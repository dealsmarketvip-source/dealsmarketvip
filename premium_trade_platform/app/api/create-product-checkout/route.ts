import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { createProductCheckoutSession } from '@/lib/stripe-products'

export async function POST(req: NextRequest) {
  try {
    const { productId, quantity = 1, successUrl, cancelUrl } = await req.json()

    // Get the authenticated user
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user has reached purchase limits
    const { data: userLimits } = await supabase
      .from('user_limits')
      .select('*')
      .eq('user_id', userProfile.id)
      .single()

    if (userLimits && userLimits.current_purchases >= userLimits.max_purchases) {
      return NextResponse.json(
        { error: 'Purchase limit reached for your subscription plan' },
        { status: 403 }
      )
    }

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        users!seller_id(id, full_name, stripe_customer_id)
      `)
      .eq('id', productId)
      .eq('status', 'active')
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found or not available' },
        { status: 404 }
      )
    }

    // Check if user is trying to buy their own product
    if (product.seller_id === userProfile.id) {
      return NextResponse.json(
        { error: 'Cannot purchase your own product' },
        { status: 400 }
      )
    }

    // Calculate total price including shipping
    const shippingCost = product.shipping_included ? 0 : product.shipping_cost
    const totalPrice = (product.price * quantity) + shippingCost

    // Create Stripe checkout session
    const session = await createProductCheckoutSession({
      customerId: userProfile.stripe_customer_id,
      userEmail: userProfile.email,
      buyerId: userProfile.id,
      sellerId: product.seller_id,
      productId: product.id,
      productTitle: product.title,
      productPrice: product.price,
      productImage: product.images?.[0],
      shippingCost: shippingCost,
      quantity: quantity,
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/product/${productId}`,
      shippingDetails: !product.shipping_included
    })

    // Log the checkout initiation
    await supabase
      .from('audit_logs')
      .insert({
        user_id: userProfile.id,
        action: 'checkout_initiated',
        resource_type: 'product',
        resource_id: productId,
        new_values: {
          total_amount: totalPrice,
          quantity: quantity,
          stripe_session_id: session.sessionId
        }
      })

    return NextResponse.json({
      sessionId: session.sessionId,
      url: session.url,
      totalAmount: totalPrice
    })

  } catch (error) {
    console.error('Error creating product checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
