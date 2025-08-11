import Stripe from 'stripe'
import { stripe } from './stripe'

// Create checkout session for product purchase
export async function createProductCheckoutSession({
  customerId,
  userEmail,
  buyerId,
  sellerId,
  productId,
  productTitle,
  productPrice,
  productImage,
  shippingCost = 0,
  quantity = 1,
  successUrl,
  cancelUrl,
  shippingDetails = true
}: {
  customerId?: string
  userEmail: string
  buyerId: string
  sellerId: string
  productId: string
  productTitle: string
  productPrice: number
  productImage?: string
  shippingCost?: number
  quantity?: number
  successUrl: string
  cancelUrl: string
  shippingDetails?: boolean
}) {
  try {
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: productTitle,
            ...(productImage && { images: [productImage] }),
            description: `Producto vendido por DealsMarket`
          },
          unit_amount: Math.round(productPrice * 100) // Convert to cents
        },
        quantity: quantity
      }
    ]

    // Add shipping as separate line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Envío',
            description: 'Coste de envío del producto'
          },
          unit_amount: Math.round(shippingCost * 100)
        },
        quantity: 1
      })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: !customerId ? userEmail : undefined,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        buyerId,
        sellerId,
        productId,
        quantity: quantity.toString(),
        type: 'product_purchase'
      },
      payment_intent_data: {
        metadata: {
          buyerId,
          sellerId,
          productId,
          quantity: quantity.toString()
        }
      },
      ...(shippingDetails && {
        shipping_address_collection: {
          allowed_countries: ['ES', 'PT', 'FR', 'IT', 'DE', 'NL', 'BE', 'LU', 'AT', 'IE']
        }
      }),
      billing_address_collection: 'required',
      // Add automatic tax calculation if available
      automatic_tax: {
        enabled: true
      },
      // Add terms of service acceptance
      consent_collection: {
        terms_of_service: 'required'
      }
    })

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('Error creating product checkout session:', error)
    throw new Error('Failed to create product checkout session')
  }
}

// Create direct payment intent for immediate payment
export async function createProductPaymentIntent({
  customerId,
  buyerId,
  sellerId,
  productId,
  productTitle,
  productPrice,
  shippingCost = 0,
  quantity = 1
}: {
  customerId?: string
  buyerId: string
  sellerId: string
  productId: string
  productTitle: string
  productPrice: number
  shippingCost?: number
  quantity?: number
}) {
  try {
    const totalAmount = (productPrice * quantity) + shippingCost

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'eur',
      customer: customerId,
      metadata: {
        buyerId,
        sellerId,
        productId,
        quantity: quantity.toString(),
        type: 'product_purchase'
      },
      description: `Compra de "${productTitle}" en DealsMarket`,
      automatic_payment_methods: {
        enabled: true
      }
    })

    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw new Error('Failed to create payment intent')
  }
}

// Calculate marketplace fees
export const calculateMarketplaceFees = (amount: number) => {
  const platformFee = amount * 0.05 // 5% platform fee
  const stripeFee = (amount * 0.014) + 0.25 // Stripe fees (1.4% + €0.25)
  const sellerAmount = amount - platformFee - stripeFee
  
  return {
    totalAmount: amount,
    platformFee: Math.round(platformFee * 100) / 100,
    stripeFee: Math.round(stripeFee * 100) / 100,
    sellerAmount: Math.round(sellerAmount * 100) / 100
  }
}

// Create transfer to seller account (for marketplace)
export async function createTransferToSeller({
  amount,
  sellerId,
  orderId,
  description
}: {
  amount: number
  sellerId: string
  orderId: string
  description: string
}) {
  try {
    // Note: This requires the seller to have a connected Stripe account
    // For simplicity, we'll just track the balance in our database
    // In a production app, you'd use Stripe Connect for actual transfers
    
    console.log(`Transfer of €${amount} to seller ${sellerId} for order ${orderId}`)
    
    return {
      success: true,
      amount,
      sellerId,
      orderId
    }
  } catch (error) {
    console.error('Error creating transfer:', error)
    throw new Error('Failed to create transfer')
  }
}

// Handle refunds
export async function createRefund({
  paymentIntentId,
  amount,
  reason = 'requested_by_customer'
}: {
  paymentIntentId: string
  amount?: number
  reason?: string
}) {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      ...(amount && { amount: Math.round(amount * 100) }),
      reason: reason as any,
      metadata: {
        refund_source: 'dealsmarket'
      }
    })

    return refund
  } catch (error) {
    console.error('Error creating refund:', error)
    throw new Error('Failed to create refund')
  }
}

// Get payment details
export async function getPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw new Error('Failed to retrieve payment intent')
  }
}

// Check if user can make purchases based on their limits
export const checkPurchaseEligibility = async (userId: string) => {
  // This would typically check against the user's subscription limits
  // Implementation would query the user_limits table
  return true // Simplified for now
}

// Validate product availability before purchase
export const validateProductPurchase = async (productId: string, quantity: number = 1) => {
  // This would check if the product is still available
  // Implementation would query the products table
  return true // Simplified for now
}
