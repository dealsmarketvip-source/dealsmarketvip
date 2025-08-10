import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(to: string, code: string, name?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DealsMarket <noreply@dealsmarket.com>',
      to: [to],
      subject: 'Verificación de Email - DealsMarket',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #F59E0B; font-size: 28px; margin: 0;">DealsMarket</h1>
            <p style="color: #6B7280; font-size: 14px; margin: 5px 0;">WHERE VERIFIED COMPANIES TRADE EXCELLENCE</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #F59E0B10, #3B82F610); padding: 30px; border-radius: 12px; text-align: center;">
            <h2 style="color: #1F2937; margin-bottom: 20px;">¡Bienvenido a DealsMarket!</h2>
            
            ${name ? `<p style="color: #4B5563; margin-bottom: 20px;">Hola ${name},</p>` : ''}
            
            <p style="color: #4B5563; margin-bottom: 30px;">
              Para completar tu registro en DealsMarket, por favor verifica tu email con el siguiente código:
            </p>
            
            <div style="background: #F59E0B; color: white; font-size: 32px; font-weight: bold; padding: 15px 30px; border-radius: 8px; letter-spacing: 8px; margin: 20px 0;">
              ${code}
            </div>
            
            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
              Este código expira en 10 minutos por seguridad.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #F9FAFB; border-radius: 8px;">
            <h3 style="color: #1F2937; margin-bottom: 15px;">¿Qué sigue después?</h3>
            <ul style="color: #4B5563; margin: 0; padding-left: 20px;">
              <li>Verifica tu email con el código</li>
              <li>Completa tu suscripción Premium ($20/mes)</li>
              <li>Accede a deals exclusivos de lujo</li>
              <li>Conecta con empresas verificadas</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 12px; margin: 0;">
              Si no solicitaste esta verificación, puedes ignorar este email.
            </p>
            <p style="color: #6B7280; font-size: 12px; margin: 5px 0;">
              © 2024 DealsMarket. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('Error sending verification email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending verification email:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(to: string, name: string, isPremium = false) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DealsMarket <welcome@dealsmarket.com>',
      to: [to],
      subject: `¡Bienvenido a DealsMarket ${isPremium ? 'Premium' : ''}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #F59E0B; font-size: 28px; margin: 0;">DealsMarket</h1>
            <p style="color: #6B7280; font-size: 14px; margin: 5px 0;">WHERE VERIFIED COMPANIES TRADE EXCELLENCE</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #F59E0B10, #3B82F610); padding: 30px; border-radius: 12px;">
            <h2 style="color: #1F2937; text-align: center; margin-bottom: 20px;">
              ¡Bienvenido ${name}!
            </h2>
            
            ${isPremium ? `
              <div style="text-align: center; margin-bottom: 20px;">
                <span style="background: #F59E0B; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                  ✨ PREMIUM ACTIVADO
                </span>
              </div>
            ` : ''}
            
            <p style="color: #4B5563; text-align: center; margin-bottom: 30px;">
              Tu cuenta ha sido ${isPremium ? 'activada con acceso Premium' : 'creada exitosamente'}. 
              Ya puedes empezar a explorar deals exclusivos.
            </p>
            
            <div style="text-align: center;">
              <a href="${process.env.APP_URL || 'https://dealsmarket.com'}/marketplace" 
                 style="background: #F59E0B; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                Explorar Marketplace
              </a>
            </div>
          </div>
          
          ${isPremium ? `
            <div style="margin-top: 20px; padding: 20px; background: #F9FAFB; border-radius: 8px;">
              <h3 style="color: #1F2937; margin-bottom: 15px;">Beneficios Premium:</h3>
              <ul style="color: #4B5563; margin: 0; padding-left: 20px;">
                <li>Acceso a deals exclusivos de lujo</li>
                <li>Verificación empresarial completa</li>
                <li>Red de empresas verificadas</li>
                <li>Soporte prioritario 24/7</li>
              </ul>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 12px; margin: 0;">
              © 2024 DealsMarket. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('Error sending welcome email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    return { success: false, error }
  }
}
