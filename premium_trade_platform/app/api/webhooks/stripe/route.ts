import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe, SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription') {
          await handleSubscriptionPayment(session)
        } else if (session.mode === 'payment') {
          await handleProductPurchase(session)
        }
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(paymentIntent)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const failedInvoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(failedInvoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

// Handle subscription payments (Premium plan)
async function handleSubscriptionPayment(session: Stripe.Checkout.Session) {
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
  const customerId = session.customer as string
  const userId = session.metadata?.userId
  const invitationCode = session.metadata?.invitationCode

  if (!userId) return

  try {
    // Update user subscription status and limits
    await supabaseAdmin
      .from('users')
      .update({
        subscription_type: 'premium',
        subscription_status: 'active',
        stripe_customer_id: customerId
      })
      .eq('id', userId)

    // Update user limits to premium
    await supabaseAdmin
      .from('user_limits')
      .update({
        max_products: SUBSCRIPTION_PLANS.premium.limits.max_products,
        max_purchases: SUBSCRIPTION_PLANS.premium.limits.max_purchases
      })
      .eq('user_id', userId)

    // Create subscription record
    await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_type: 'premium',
        status: 'active',
        price_paid: (subscription.items.data[0].price.unit_amount || 0) / 100,
        currency: subscription.items.data[0].price.currency,
        billing_period: subscription.items.data[0].price.recurring?.interval === 'month' ? 'monthly' : 'yearly',
        stripe_subscription_id: subscription.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      })

    // Create transaction record
    await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'subscription',
        amount: (subscription.items.data[0].price.unit_amount || 0) / 100,
        currency: subscription.items.data[0].price.currency,
        description: `Suscripción Premium - ${subscription.items.data[0].price.recurring?.interval}`,
        stripe_transaction_id: subscription.id,
        status: 'completed'
      })

    // Use invitation code if provided
    if (invitationCode) {
      await supabaseAdmin.rpc('use_invitation_code', {
        code_input: invitationCode,
        user_id_input: userId
      })
    }

    // Log the subscription creation
    await supabaseAdmin
      .from('audit_logs')
      .insert({
        user_id: userId,
        action: 'subscription_created',
        resource_type: 'subscription',
        resource_id: subscription.id,
        new_values: {
          plan: 'premium',
          amount: (subscription.items.data[0].price.unit_amount || 0) / 100,
          currency: subscription.items.data[0].price.currency
        }
      })

    console.log(`Subscription created for user ${userId}`)
  } catch (error) {
    console.error('Error handling subscription payment:', error)
    throw error
  }
}

// Handle product purchases
async function handleProductPurchase(session: Stripe.Checkout.Session) {
  const buyerId = session.metadata?.buyerId
  const productId = session.metadata?.productId
  const sellerId = session.metadata?.sellerId
  const quantity = parseInt(session.metadata?.quantity || '1')

  if (!buyerId || !productId || !sellerId) return

  try {
    // Get product details
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (!product) throw new Error('Product not found')

    const totalAmount = session.amount_total ? session.amount_total / 100 : product.price
    const shippingCost = product.shipping_included ? 0 : product.shipping_cost

    // Create order
    const { data: order } = await supabaseAdmin
      .from('orders')
      .insert({
        buyer_id: buyerId,
        seller_id: sellerId,
        product_id: productId,
        quantity: quantity,
        unit_price: product.price,
        total_amount: totalAmount,
        shipping_cost: shippingCost,
        status: 'paid',
        payment_method: 'stripe',
        stripe_payment_intent_id: session.payment_intent as string,
        shipping_address: session.shipping_details
      })
      .select()
      .single()

    if (!order) throw new Error('Failed to create order')

    // Update product status if it's a single item
    if (quantity >= 1) {
      await supabaseAdmin
        .from('products')
        .update({ status: 'sold' })
        .eq('id', productId)
    }

    // Create transaction for buyer
    await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: buyerId,
        order_id: order.id,
        type: 'purchase',
        amount: -totalAmount,
        currency: 'eur',
        description: `Compra: ${product.title}`,
        stripe_transaction_id: session.payment_intent as string,
        status: 'completed'
      })

    // Create transaction for seller (minus platform fee)
    const platformFee = totalAmount * 0.05 // 5% platform fee
    const sellerAmount = totalAmount - platformFee

    await supabaseAdmin
      .from('transactions')
      .insert({
        user_id: sellerId,
        order_id: order.id,
        type: 'sale',
        amount: sellerAmount,
        currency: 'eur',
        description: `Venta: ${product.title}`,
        stripe_transaction_id: session.payment_intent as string,
        status: 'completed'
      })

    // Update seller's account balance
    const { data: seller } = await supabaseAdmin
      .from('users')
      .select('account_balance')
      .eq('id', sellerId)
      .single()

    await supabaseAdmin
      .from('users')
      .update({
        account_balance: (seller?.account_balance || 0) + sellerAmount
      })
      .eq('id', sellerId)

    // Update buyer's purchase count
    const { data: buyerLimits } = await supabaseAdmin
      .from('user_limits')
      .select('current_purchases')
      .eq('user_id', buyerId)
      .single()

    await supabaseAdmin
      .from('user_limits')
      .update({
        current_purchases: (buyerLimits?.current_purchases || 0) + 1
      })
      .eq('user_id', buyerId)

    // Log the purchase
    await supabaseAdmin
      .from('audit_logs')
      .insert({
        user_id: buyerId,
        action: 'product_purchased',
        resource_type: 'order',
        resource_id: order.id,
        new_values: {
          product_id: productId,
          amount: totalAmount,
          seller_id: sellerId
        }
      })

    console.log(`Product purchase completed for order ${order.id}`)
  } catch (error) {
    console.error('Error handling product purchase:', error)
    throw error
  }
}

// Handle payment intent succeeded
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Payment intent ${paymentIntent.id} succeeded`)
  // Additional processing if needed
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { data: existingSubscription } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (existingSubscription) {
    const userId = existingSubscription.user_id

    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: subscription.status === 'active' ? 'active' : 'cancelled',
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null
      })
      .eq('stripe_subscription_id', subscription.id)

    await supabaseAdmin
      .from('users')
      .update({
        subscription_status: subscription.status === 'active' ? 'active' : 'cancelled'
      })
      .eq('id', userId)
  }
}

// Handle subscription deleted
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { data: deletedSub } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  if (deletedSub) {
    const userId = deletedSub.user_id

    // Revert to free plan limits
    await supabaseAdmin
      .from('user_limits')
      .update({
        max_products: SUBSCRIPTION_PLANS.free.limits.max_products,
        max_purchases: SUBSCRIPTION_PLANS.free.limits.max_purchases
      })
      .eq('user_id', userId)

    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    await supabaseAdmin
      .from('users')
      .update({
        subscription_type: 'free',
        subscription_status: 'inactive'
      })
      .eq('id', userId)
  }
}

// Handle invoice payment succeeded
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`Invoice payment succeeded: ${invoice.id}`)
}

// Handle invoice payment failed
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`Invoice payment failed: ${invoice.id}`)
  
  // Could implement retry logic or notification here
}
