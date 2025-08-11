import { Resend } from 'resend'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email templates
export const EMAIL_TEMPLATES = {
  WELCOME: 'welcome',
  VERIFICATION_SUBMITTED: 'verification_submitted',
  VERIFICATION_APPROVED: 'verification_approved',
  VERIFICATION_REJECTED: 'verification_rejected',
  PRODUCT_SOLD: 'product_sold',
  PRODUCT_PURCHASED: 'product_purchased',
  PAYMENT_SUCCESSFUL: 'payment_successful',
  ORDER_SHIPPED: 'order_shipped',
  ORDER_DELIVERED: 'order_delivered',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  PASSWORD_RESET: 'password_reset'
} as const

type EmailTemplate = typeof EMAIL_TEMPLATES[keyof typeof EMAIL_TEMPLATES]

// Email sending utility
export async function sendEmail({
  to,
  subject,
  html,
  from = 'DealsMarket <noreply@dealsmarket.vip>',
  replyTo
}: {
  to: string | string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      ...(replyTo && { replyTo })
    })

    if (error) {
      console.error('Error sending email:', error)
      throw new Error(error.message)
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}

// Welcome email
export async function sendWelcomeEmail({
  to,
  userName,
  userType = 'individual'
}: {
  to: string
  userName: string
  userType?: 'individual' | 'business' | 'freelancer'
}) {
  const subject = '¡Bienvenido a DealsMarket!'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bienvenido a DealsMarket</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { background: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Bienvenido a DealsMarket!</h1>
          <p>Tu marketplace de confianza para comprar y vender</p>
        </div>
        <div class="content">
          <h2>Hola ${userName},</h2>
          <p>¡Gracias por unirte a DealsMarket! Estamos emocionados de tenerte en nuestra comunidad.</p>
          
          <h3>Próximos pasos:</h3>
          <ul>
            <li><strong>Completa tu perfil:</strong> Añade tu información personal y foto de perfil</li>
            <li><strong>Verifica tu cuenta:</strong> Sube tus documentos para obtener la insignia de verificado</li>
            <li><strong>Explora el marketplace:</strong> Descubre productos únicos de vendedores verificados</li>
            ${userType !== 'individual' ? '<li><strong>Sube tu primer producto:</strong> Comienza a vender en nuestra plataforma</li>' : ''}
          </ul>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile" class="button">Completar Perfil</a>

          <p>Si tienes alguna pregunta, no dudes en contactarnos. ¡Estamos aquí para ayudarte!</p>
          
          <p>Saludos,<br>El equipo de DealsMarket</p>
        </div>
        <div class="footer">
          <p>DealsMarket - Tu marketplace de confianza</p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}">Visitar DealsMarket</a></p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

// Verification submitted email
export async function sendVerificationSubmittedEmail({
  to,
  userName
}: {
  to: string
  userName: string
}) {
  const subject = 'Verificación enviada - DealsMarket'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verificación Enviada</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .status-box { background: #E0F2FE; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verificación Enviada</h1>
        </div>
        <div class="content">
          <h2>Hola ${userName},</h2>
          <p>Hemos recibido tu solicitud de verificación correctamente.</p>
          
          <div class="status-box">
            <h3>Estado: En revisión</h3>
            <p>Nuestro equipo revisará tus documentos en un plazo de 24-48 horas.</p>
          </div>

          <p>Te notificaremos por email cuando el proceso esté completo.</p>
          
          <p>Gracias por tu paciencia.</p>
          
          <p>Saludos,<br>El equipo de DealsMarket</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

// Verification approved email
export async function sendVerificationApprovedEmail({
  to,
  userName
}: {
  to: string
  userName: string
}) {
  const subject = '¡Verificación aprobada! - DealsMarket'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verificación Aprobada</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { background: #10B981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .success-box { background: #D1FAE5; border-left: 4px solid #10B981; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Verificación Aprobada!</h1>
        </div>
        <div class="content">
          <h2>¡Felicidades ${userName}!</h2>
          
          <div class="success-box">
            <h3>Tu cuenta ha sido verificada exitosamente</h3>
            <p>Ahora tienes acceso completo a todas las funciones premium de DealsMarket.</p>
          </div>

          <h3>Beneficios de tu cuenta verificada:</h3>
          <ul>
            <li>✅ Insignia de verificado en tu perfil</li>
            <li>✅ Mayor confianza de los compradores</li>
            <li>✅ Acceso a funciones premium</li>
            <li>✅ Prioridad en soporte al cliente</li>
          </ul>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace" class="button">Explorar Marketplace</a>
          
          <p>¡Gracias por formar parte de nuestra comunidad verificada!</p>
          
          <p>Saludos,<br>El equipo de DealsMarket</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

// Product sold notification
export async function sendProductSoldEmail({
  to,
  sellerName,
  productTitle,
  salePrice,
  buyerName
}: {
  to: string
  sellerName: string
  productTitle: string
  salePrice: number
  buyerName: string
}) {
  const subject = `¡Has vendido "${productTitle}"! - DealsMarket`
  
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(salePrice)

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Producto Vendido</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { background: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .sale-details { background: #D1FAE5; padding: 20px; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Felicidades por tu venta!</h1>
        </div>
        <div class="content">
          <h2>Hola ${sellerName},</h2>
          <p>¡Excelentes noticias! Tu producto ha sido vendido.</p>
          
          <div class="sale-details">
            <h3>Detalles de la venta:</h3>
            <ul>
              <li><strong>Producto:</strong> ${productTitle}</li>
              <li><strong>Precio de venta:</strong> ${formattedPrice}</li>
              <li><strong>Comprador:</strong> ${buyerName}</li>
            </ul>
          </div>

          <h3>Próximos pasos:</h3>
          <ol>
            <li>Prepara el producto para envío</li>
            <li>Contacta al comprador si es necesario</li>
            <li>El pago se procesará automáticamente</li>
          </ol>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile" class="button">Ver Mi Perfil</a>
          
          <p>¡Gracias por usar DealsMarket!</p>
          
          <p>Saludos,<br>El equipo de DealsMarket</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

// Product purchased notification
export async function sendProductPurchasedEmail({
  to,
  buyerName,
  productTitle,
  totalAmount,
  sellerName,
  orderId
}: {
  to: string
  buyerName: string
  productTitle: string
  totalAmount: number
  sellerName: string
  orderId: string
}) {
  const subject = `Compra confirmada: "${productTitle}" - DealsMarket`
  
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(totalAmount)

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Compra Confirmada</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { background: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .order-details { background: #E0F2FE; padding: 20px; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Compra Confirmada!</h1>
        </div>
        <div class="content">
          <h2>Hola ${buyerName},</h2>
          <p>Tu compra ha sido procesada exitosamente.</p>
          
          <div class="order-details">
            <h3>Detalles del pedido:</h3>
            <ul>
              <li><strong>Pedido #:</strong> ${orderId}</li>
              <li><strong>Producto:</strong> ${productTitle}</li>
              <li><strong>Total pagado:</strong> ${formattedPrice}</li>
              <li><strong>Vendedor:</strong> ${sellerName}</li>
            </ul>
          </div>

          <h3>¿Qué sigue?</h3>
          <p>El vendedor preparará tu pedido y te contactará para coordinar la entrega. Recibirás actualizaciones por email sobre el estado de tu pedido.</p>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile" class="button">Ver Mis Compras</a>
          
          <p>¡Gracias por tu compra!</p>
          
          <p>Saludos,<br>El equipo de DealsMarket</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

// Subscription created email
export async function sendSubscriptionCreatedEmail({
  to,
  userName,
  planType,
  amount
}: {
  to: string
  userName: string
  planType: string
  amount: number
}) {
  const subject = 'Suscripción Premium activada - DealsMarket'
  
  const formattedPrice = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Suscripción Premium Activada</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { background: #F59E0B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .premium-box { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Bienvenido a Premium!</h1>
        </div>
        <div class="content">
          <h2>Hola ${userName},</h2>
          <p>Tu suscripción Premium ha sido activada exitosamente.</p>
          
          <div class="premium-box">
            <h3>Detalles de tu suscripción:</h3>
            <ul>
              <li><strong>Plan:</strong> ${planType}</li>
              <li><strong>Precio:</strong> ${formattedPrice}/mes</li>
              <li><strong>Estado:</strong> Activa</li>
            </ul>
          </div>

          <h3>Beneficios Premium:</h3>
          <ul>
            <li>🎯 Hasta 3 productos para vender</li>
            <li>🛒 Hasta 5 compras por mes</li>
            <li>✅ Verificación empresarial completa</li>
            <li>🤝 Networking con empresas verificadas</li>
            <li>📊 Analytics avanzados</li>
            <li>🆘 Soporte prioritario 24/7</li>
          </ul>

          <a href="${process.env.NEXT_PUBLIC_APP_URL}/marketplace" class="button">Explorar Marketplace</a>
          
          <p>¡Disfruta de todos los beneficios Premium!</p>
          
          <p>Saludos,<br>El equipo de DealsMarket</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

// Password reset email
export async function sendPasswordResetEmail({
  to,
  resetUrl
}: {
  to: string
  resetUrl: string
}) {
  const subject = 'Restablece tu contraseña - DealsMarket'
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Restablecer Contraseña</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #EF4444; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { background: #EF4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .warning-box { background: #FEF2F2; border-left: 4px solid #EF4444; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Restablecer Contraseña</h1>
        </div>
        <div class="content">
          <p>Has solicitado restablecer tu contraseña en DealsMarket.</p>
          
          <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

          <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
          
          <div class="warning-box">
            <p><strong>Importante:</strong> Este enlace expirará en 1 hora por motivos de seguridad.</p>
          </div>

          <p>Si no solicitaste este restablecimiento, puedes ignorar este email de forma segura.</p>
          
          <p>Saludos,<br>El equipo de DealsMarket</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({ to, subject, html })
}

// Utility function to send notification emails based on events
export async function sendNotificationEmail(
  type: EmailTemplate,
  recipient: string,
  data: Record<string, any>
) {
  try {
    switch (type) {
      case EMAIL_TEMPLATES.WELCOME:
        return await sendWelcomeEmail({
          to: recipient,
          userName: data.userName,
          userType: data.userType
        })

      case EMAIL_TEMPLATES.VERIFICATION_SUBMITTED:
        return await sendVerificationSubmittedEmail({
          to: recipient,
          userName: data.userName
        })

      case EMAIL_TEMPLATES.VERIFICATION_APPROVED:
        return await sendVerificationApprovedEmail({
          to: recipient,
          userName: data.userName
        })

      case EMAIL_TEMPLATES.PRODUCT_SOLD:
        return await sendProductSoldEmail({
          to: recipient,
          sellerName: data.sellerName,
          productTitle: data.productTitle,
          salePrice: data.salePrice,
          buyerName: data.buyerName
        })

      case EMAIL_TEMPLATES.PRODUCT_PURCHASED:
        return await sendProductPurchasedEmail({
          to: recipient,
          buyerName: data.buyerName,
          productTitle: data.productTitle,
          totalAmount: data.totalAmount,
          sellerName: data.sellerName,
          orderId: data.orderId
        })

      case EMAIL_TEMPLATES.SUBSCRIPTION_CREATED:
        return await sendSubscriptionCreatedEmail({
          to: recipient,
          userName: data.userName,
          planType: data.planType,
          amount: data.amount
        })

      case EMAIL_TEMPLATES.PASSWORD_RESET:
        return await sendPasswordResetEmail({
          to: recipient,
          resetUrl: data.resetUrl
        })

      default:
        throw new Error(`Unknown email template: ${type}`)
    }
  } catch (error) {
    console.error(`Failed to send ${type} email to ${recipient}:`, error)
    throw error
  }
}
