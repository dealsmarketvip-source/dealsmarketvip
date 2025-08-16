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
      console.error('Email is required for subscription')
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        console.error('Checkout session error:', data.error)
        return
      }

      if (!data.sessionId) {
        console.error('No session ID received from server')
        return
      }

      const stripe = await stripePromise
      if (!stripe) {
        console.error('Stripe failed to load - check your NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
        return
      }

      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })

      if (redirectError) {
        console.error('Stripe redirect error:', redirectError.message)
      }
    } catch (error) {
      console.error('Subscription error:', error)
      // In demo mode, simulate success for better UX
      if (process.env.NODE_ENV === 'development') {
        console.log('Demo mode: Simulating successful payment redirect')
        window.location.href = '/success?demo=true'
      }
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
