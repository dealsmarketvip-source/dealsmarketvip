import Stripe from 'stripe'

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  premium: {
    name: 'Premium',
    price: 20, // $20 USD
    currency: 'usd',
    interval: 'month' as const,
    features: [
      'Verificación empresarial completa',
      'Acceso a deals exclusivos de lujo',
      'Networking con empresas verificadas',
      'Soporte prioritario 24/7',
      'Dashboard analytics avanzado'
    ]
  }
} as const

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
              description: 'Acceso premium a DealsMarket con verificación empresarial',
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
