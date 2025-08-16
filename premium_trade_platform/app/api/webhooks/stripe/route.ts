import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
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
          const userId = session.metadata?.userId
          const invitationCode = session.metadata?.invitationCode
          
          if (userId) {
            // Update user subscription status
            await supabaseAdmin
              .from('users')
              .update({
                subscription_type: 'premium',
                subscription_status: 'active',
                verification_status: invitationCode ? 'verified' : 'pending'
              })
              .eq('id', userId)

            // Create subscription record
            await supabaseAdmin
              .from('subscriptions')
              .insert({
                user_id: userId,
                subscription_type: 'premium',
                status: 'active',
                price_paid: 20.00,
                currency: 'USD',
                billing_period: 'monthly',
                stripe_subscription_id: session.subscription as string,
                current_period_start: new Date().toISOString(),
                current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              })

            // If invitation code was used, mark user as verified and use the code
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
                resource_type: 'subscriptions',
                details: {
                  stripe_session_id: session.id,
                  invitation_code: invitationCode,
                  amount: session.amount_total
                }
              })
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('stripe_subscription_id', subscription.id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          // Update subscription status
          await supabaseAdmin
            .from('subscriptions')
            .update({
              status: 'cancelled',
              cancelled_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription.id)

          // Update user status
          await supabaseAdmin
            .from('users')
            .update({
              subscription_status: 'inactive'
            })
            .eq('id', userId)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error handling webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
