import Stripe from 'stripe'

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build_only', {
  apiVersion: '2024-06-20',
})

// Subscription plans with specific limits
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Gratuito',
    price: 0,
    currency: 'usd',
    interval: 'month' as const,
    limits: {
      max_products: 0, // No products allowed
      max_purchases: 1 // Only 1 purchase allowed
    },
    features: [
      'Navegación básica del marketplace',
      '1 compra por mes',
      'Sin verificación empresarial'
    ]
  },
  premium: {
    name: 'Premium',
    price: 20, // $20 USD
    currency: 'usd',
    interval: 'month' as const,
    limits: {
      max_products: 3, // Maximum 3 products to sell
      max_purchases: 5 // Maximum 5 purchases per month
    },
    features: [
      'Hasta 3 productos para vender',
      'Hasta 5 compras por mes',
      'Verificación empresarial completa',
      'Acceso a deals exclusivos',
      'Networking con empresas verificadas',
      'Soporte prioritario 24/7',
      'Dashboard analytics avanzado',
      'Comisiones reducidas en ventas'
    ]
  }
} as const

// Plan utilities
export const getPlanLimits = (planType: 'free' | 'premium') => {
  return SUBSCRIPTION_PLANS[planType].limits
}

export const canUserPerformAction = (userLimits: any, action: 'create_product' | 'make_purchase') => {
  if (action === 'create_product') {
    return userLimits.current_products < userLimits.max_products
  }
  if (action === 'make_purchase') {
    return userLimits.current_purchases < userLimits.max_purchases
  }
  return false
}

// Create a checkout session for subscription
export async function createCheckoutSession({
  customerId,
  userEmail,
  userId,
  successUrl,
  cancelUrl,
  invitationCode
}: {
  customerId?: string
  userEmail: string
  userId: string
  successUrl: string
  cancelUrl: string
  invitationCode?: string
}) {
  try {
    // Check if invitation code provides discount
    let discountCoupon: string | undefined
    if (invitationCode) {
      // Here you would validate the invitation code and get discount
      // For now, we'll create a sample discount
      const discounts = {
        'PREMIUM2024': 50, // 50% off
        'LUXURY100': 100, // Free first month
        'BETA50': 25 // 25% off
      }
      
      const discountPercent = discounts[invitationCode as keyof typeof discounts]
      if (discountPercent) {
        // Create a coupon if it doesn't exist
        try {
          await stripe.coupons.retrieve(`${invitationCode.toLowerCase()}-${discountPercent}`)
        } catch {
          await stripe.coupons.create({
            id: `${invitationCode.toLowerCase()}-${discountPercent}`,
            percent_off: discountPercent,
            duration: discountPercent === 100 ? 'once' : 'forever',
            name: `Invitation Code: ${invitationCode}`
          })
        }
        discountCoupon = `${invitationCode.toLowerCase()}-${discountPercent}`
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: !customerId ? userEmail : undefined,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: SUBSCRIPTION_PLANS.premium.currency,
            product_data: {
              name: 'DealsMarket Premium',
              description: 'Plan Premium: 3 productos para vender, 5 compras mensuales, verificación empresarial',
            },
            unit_amount: SUBSCRIPTION_PLANS.premium.price * 100, // Convert to cents
            recurring: {
              interval: SUBSCRIPTION_PLANS.premium.interval,
            },
          },
          quantity: 1,
        },
      ],
      ...(discountCoupon && {
        discounts: [{
          coupon: discountCoupon
        }]
      }),
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        invitationCode: invitationCode || '',
      },
      subscription_data: {
        metadata: {
          userId,
          invitationCode: invitationCode || '',
        },
      },
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

// Create a customer in Stripe
export async function createStripeCustomer({
  email,
  name,
  metadata
}: {
  email: string
  name?: string
  metadata?: Record<string, string>
}) {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    })
    return customer
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    throw new Error('Failed to create customer')
  }
}

// Retrieve a subscription
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error retrieving subscription:', error)
    throw new Error('Failed to retrieve subscription')
  }
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId)
    return subscription
  } catch (error) {
    console.error('Error canceling subscription:', error)
    throw new Error('Failed to cancel subscription')
  }
}

// Handle webhook events
export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      const checkoutSession = event.data.object as Stripe.Checkout.Session
      // Handle successful payment
      console.log('Payment successful:', checkoutSession.id)
      break
      
    case 'customer.subscription.created':
      const subscription = event.data.object as Stripe.Subscription
      // Handle new subscription
      console.log('New subscription:', subscription.id)
      break
      
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object as Stripe.Subscription
      // Handle subscription update
      console.log('Subscription updated:', updatedSubscription.id)
      break
      
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription
      // Handle subscription cancellation
      console.log('Subscription cancelled:', deletedSubscription.id)
      break
      
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}
