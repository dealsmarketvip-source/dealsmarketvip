// Mock email service - Resend not configured yet
export async function sendVerificationEmail(to: string, code: string, name?: string) {
  // Simulate email sending for development
  console.log(`📧 Mock email sent to ${to}: Verification code ${code}`)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return { 
    success: true, 
    data: { 
      id: `mock_${Date.now()}`,
      to: [to],
      subject: 'Verificación de Email - DealsMarket'
    } 
  }
}

export async function sendWelcomeEmail(to: string, name: string, isPremium = false) {
  // Simulate email sending for development
  console.log(`📧 Mock welcome email sent to ${to} (${name}) - Premium: ${isPremium}`)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return { 
    success: true, 
    data: { 
      id: `mock_welcome_${Date.now()}`,
      to: [to],
      subject: `¡Bienvenido a DealsMarket ${isPremium ? 'Premium' : ''}!`
    } 
  }
}

// Generate verification code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
