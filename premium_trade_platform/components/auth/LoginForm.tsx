"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Mail, Shield, ArrowRight, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth-instant'

interface LoginFormProps {
  onSuccess?: (user: any) => void
  redirectTo?: string
}

export function LoginForm({ onSuccess, redirectTo = '/marketplace' }: LoginFormProps) {
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const router = useRouter()
  const { sendLoginCode, verifyLoginCode } = useAuth()

  const startCountdown = () => {
    let seconds = 600 // 10 minutes
    setTimeLeft(seconds)
    
    const interval = setInterval(() => {
      seconds--
      setTimeLeft(seconds)
      
      if (seconds <= 0) {
        clearInterval(interval)
        setStep('email')
        setCodeSent(false)
        toast.error('Código expirado. Solicita uno nuevo.')
      }
    }, 1000)

    return () => clearInterval(interval)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      toast.error('Por favor, introduce un email válido')
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await sendLoginCode(email)

      if (error) {
        throw error
      }

      setCodeSent(true)
      setStep('code')
      startCountdown()
      toast.success('Código enviado a tu email')

    } catch (error: any) {
      toast.error(error.message || 'Error al enviar el código')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!code || code.length !== 6) {
      toast.error('Por favor, introduce el código de 6 dígitos')
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await verifyLoginCode(email, code)

      if (error) {
        throw error
      }

      toast.success('¡Inicio de sesión exitoso!')

      if (onSuccess) {
        onSuccess(data.user)
      }

      // Redirect to marketplace or specified route
      router.push(redirectTo)

    } catch (error: any) {
      toast.error(error.message || 'Error al verificar el código')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep('email')
    setCode('')
  }

  const handleResendCode = async () => {
    setCode('')
    await handleSendCode({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="relative overflow-hidden bg-card/95 backdrop-blur-sm border border-border/50">
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0"
          animate={{
            opacity: [0, 0.5, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <CardHeader className="space-y-4 text-center relative z-10">
          <motion.div
            className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            animate={{
              boxShadow: [
                "0 0 20px rgba(245, 158, 11, 0.3)",
                "0 0 40px rgba(245, 158, 11, 0.6)",
                "0 0 20px rgba(245, 158, 11, 0.3)"
              ]
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {step === 'email' ? (
              <Mail className="h-8 w-8 text-primary-foreground" />
            ) : (
              <Shield className="h-8 w-8 text-primary-foreground" />
            )}
          </motion.div>
          
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {step === 'email' ? 'Iniciar Sesión' : 'Verificar Código'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {step === 'email' 
                ? 'Introduce tu email para recibir un código de acceso'
                : 'Introduce el código de 6 dígitos enviado a tu email'
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.form
                key="email-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendCode}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@empresa.com"
                      className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" variant="default" />
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Enviar Código
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.form>
            ) : (
              <motion.form
                key="code-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifyCode}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium">
                    Código de Verificación
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="code"
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="pl-10 h-12 text-center text-lg font-mono tracking-widest bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                      maxLength={6}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Código enviado a: <span className="font-medium">{email}</span>
                  </p>
                </div>

                {timeLeft > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20"
                  >
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Expira en: {formatTime(timeLeft)}
                    </span>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg"
                      disabled={isLoading || code.length !== 6}
                    >
                      {isLoading ? (
                        <LoadingSpinner size="sm" variant="default" />
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Verificar Código
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1 h-10"
                      disabled={isLoading}
                    >
                      Volver
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendCode}
                      className="flex-1 h-10"
                      disabled={isLoading || timeLeft > 540} // Can resend after 1 minute
                    >
                      Reenviar
                    </Button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs text-muted-foreground space-y-1"
          >
            <p>🔒 Tu información está protegida con encriptación de nivel empresarial</p>
            <p>Solo empresas verificadas pueden acceder a DealsMarket</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
