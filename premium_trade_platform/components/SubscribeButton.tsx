"use client"

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder_for_demo'
)

interface SubscribeButtonProps {
  userId?: string
  email: string
  className?: string
}

export default function SubscribeButton({ userId, email, className }: SubscribeButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!email) {
      alert('Email is required to subscribe')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userId,
        }),
      })

      const { sessionId, error } = await response.json()

      if (error) {
        console.error('Error creating checkout session:', error)
        alert('Error creating checkout session')
        return
      }

      const stripe = await stripePromise
      if (!stripe) {
        console.error('Stripe failed to load')
        alert('Payment system failed to load')
        return
      }

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (redirectError) {
        console.error('Error redirecting to checkout:', redirectError)
        alert('Error redirecting to payment')
      }
    } catch (error) {
      console.error('Error in subscription process:', error)
      alert('An error occurred during subscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      className={className}
    >
      {loading ? 'Procesando...' : 'Suscribirme por 20 €'}
    </Button>
  )
}
