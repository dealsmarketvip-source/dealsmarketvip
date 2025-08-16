
import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
  typescript: true,
})

export const getStripeSession = async ({
  priceId,
  domainUrl,
  customerId,
}: {
  priceId: string
  domainUrl: string
  customerId: string
}) => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${domainUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domainUrl}/pricing`,
    subscription_data: {
      metadata: {
        userId: customerId,
      },
    },
  })

  return session
}
