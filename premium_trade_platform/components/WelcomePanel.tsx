"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Crown,
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Key,
  Shield,
  Users,
  DollarSign,
  Globe,
  Star
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'
import SubscribeButton from './SubscribeButton'
import { LoadingSpinner } from './loading-spinner'

interface WelcomePanelProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'welcome' | 'choose-method' | 'invitation-code' | 'payment' | 'success'

export function WelcomePanel({ isOpen, onClose }: WelcomePanelProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome')
  const [invitationCode, setInvitationCode] = useState('')
  const [isValidatingCode, setIsValidatingCode] = useState(false)
  const [codeValidation, setCodeValidation] = useState<{
    isValid: boolean | null
    message: string
    accountData?: any
  }>({ isValid: null, message: '' })
  
  const { user, validateInvitationCode } = useAuth()

  const handleNext = () => {
    if (currentStep === 'welcome') {
      setCurrentStep('choose-method')
    }
  }

  const handlePrevious = () => {
    if (currentStep === 'choose-method') {
      setCurrentStep('welcome')
    } else if (currentStep === 'invitation-code' || currentStep === 'payment') {
      setCurrentStep('choose-method')
    }
  }

  const handleMethodChoice = (method: 'invitation' | 'payment') => {
    if (method === 'invitation') {
      setCurrentStep('invitation-code')
    } else {
      setCurrentStep('payment')
    }
  }

  const validateCode = async (code: string) => {
    if (!code.trim()) {
      setCodeValidation({ isValid: null, message: '' })
      return
    }

    setIsValidatingCode(true)
    try {
      const result = await validateInvitationCode(code)
      setCodeValidation({
        isValid: result.isValid,
        message: result.message,
        accountData: result.accountData
      })

      if (result.isValid) {
        toast.success(result.message)
        // Instantly move to success without delay
        setCurrentStep('success')
        // Auto-redirect after short delay
        setTimeout(() => {
          window.location.href = '/marketplace'
        }, 500)
      }
    } catch (error) {
      setCodeValidation({
        isValid: false,
        message: '❌ Error validating code'
      })
    } finally {
      setIsValidatingCode(false)
    }
  }

  const handleCodeSubmit = () => {
    validateCode(invitationCode)
  }

  const stats = [
    {
      value: "Over $50",
      unit: "million",
      suffix: "",
      subtitle: "Monthly Volume",
      icon: <DollarSign className="h-8 w-8 text-primary" />
    },
    {
      value: "Over 500",
      unit: "",
      suffix: "",
      subtitle: "Verified Companies",
      icon: <Users className="h-8 w-8 text-blue-400" />
    },
    {
      value: "98%",
      unit: "",
      suffix: "",
      subtitle: "Success Rate",
      icon: <Star className="h-8 w-8 text-green-400" />
    }
  ]

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-8"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Crown className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">DEALS MARKET</h1>
        </div>
        
        <h2 className="text-3xl font-bold text-foreground">
          Welcome to DealsMarket
        </h2>
        
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Where verified companies create million-dollar opportunities
        </p>
      </div>

      <motion.div
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="flex justify-center"
      >
        <Crown className="h-20 w-20 text-primary" />
      </motion.div>

      <div className="space-y-6">
        <p className="text-foreground font-medium">
          Join an exclusive network of verified companies that do million-dollar business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
              className="text-center space-y-2"
            >
              <div className="flex justify-center mb-2">
                {stat.icon}
              </div>
              <div className="text-xl font-bold text-primary">
                {stat.value}
              </div>
              {stat.unit && (
                <div className="text-lg font-semibold text-primary">
                  {stat.unit}
                </div>
              )}
              {stat.suffix && (
                <div className="text-lg font-semibold text-primary">
                  {stat.suffix}
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                {stat.subtitle}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const renderChooseMethodStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          Choose Your Access Method
        </h2>
        <p className="text-muted-foreground">
          Select how you want to join DealsMarket
        </p>
      </div>

      <div className="grid gap-4">
        <Card 
          className="p-6 cursor-pointer border-primary/30 hover:border-primary/60 transition-all hover:scale-[1.02]"
          onClick={() => handleMethodChoice('invitation')}
        >
          <div className="flex items-center space-x-4">
            <Key className="h-10 w-10 text-primary" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Invitation Code</h3>
              <p className="text-muted-foreground text-sm">
                Access with your enterprise invitation code
              </p>
            </div>
            <Badge className="bg-green-500/20 text-green-400">
              FREE
            </Badge>
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer border-blue-500/30 hover:border-blue-500/60 transition-all hover:scale-[1.02]"
          onClick={() => handleMethodChoice('payment')}
        >
          <div className="flex items-center space-x-4">
            <CreditCard className="h-10 w-10 text-blue-500" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Premium Subscription</h3>
              <p className="text-muted-foreground text-sm">
                Complete access for €20/month
              </p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400">
              €20/mes
            </Badge>
          </div>
        </Card>
      </div>
    </motion.div>
  )

  const renderInvitationCodeStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <Key className="h-16 w-16 text-primary mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">
          Invitation Code
        </h2>
        <p className="text-muted-foreground">
          Enter your code for instant access
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="code">Invitation Code</Label>
          <div className="relative">
            <Key className="absolute left-3 top-3 h-4 w-4 text-primary z-20" />
            <Input
              id="code"
              placeholder="Enter your code..."
              className="pl-10 text-center text-lg tracking-wider uppercase"
              value={invitationCode}
              onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleCodeSubmit()}
            />
          </div>
        </div>

        {codeValidation.message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg border ${
              codeValidation.isValid 
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {codeValidation.message}
          </motion.div>
        )}

        <Button
          onClick={handleCodeSubmit}
          disabled={!invitationCode.trim() || isValidatingCode}
          className="w-full gradient-primary"
        >
          {isValidatingCode ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2">Validating...</span>
            </div>
          ) : (
            'Validate Code'
          )}
        </Button>
      </div>
    </motion.div>
  )

  const renderPaymentStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center space-y-4">
        <CreditCard className="h-16 w-16 text-blue-500 mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">
          Premium Subscription
        </h2>
        <p className="text-muted-foreground">
          Complete platform access
        </p>
      </div>

      <Card className="border-blue-500/30">
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">€20/mes</div>
            <p className="text-muted-foreground">Monthly billing</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Complete marketplace access</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Business verification</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Priority 24/7 support</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Advanced analytics</span>
            </div>
          </div>
        </div>
      </Card>

      <SubscribeButton 
        userId={user?.id}
        email={user?.email || 'demo@dealsmarket.com'}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      />
    </motion.div>
  )

  const renderSuccessStep = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Welcome to DealsMarket!
        </h2>
        <p className="text-muted-foreground">
          Your account has been created successfully
        </p>
      </div>

      {codeValidation.accountData && (
        <Card className="border-primary/30">
          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-primary">Your account information:</h3>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Company:</span> {codeValidation.accountData.company_name}</div>
              <div><span className="font-medium">Plan:</span> {codeValidation.accountData.subscription_type}</div>
            </div>
          </div>
        </Card>
      )}

      <Button
        onClick={() => {
          // Instant redirect without closing modal first
          window.location.href = '/marketplace'
        }}
        className="w-full gradient-primary"
      >
        Go to Marketplace
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </motion.div>
  )

  const canGoBack = currentStep === 'choose-method' || currentStep === 'invitation-code' || currentStep === 'payment'
  const canGoNext = currentStep === 'welcome'

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-card border border-border rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto glow-primary"
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="min-h-[400px] flex flex-col justify-between">
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {currentStep === 'welcome' && renderWelcomeStep()}
                  {currentStep === 'choose-method' && renderChooseMethodStep()}
                  {currentStep === 'invitation-code' && renderInvitationCodeStep()}
                  {currentStep === 'payment' && renderPaymentStep()}
                  {currentStep === 'success' && renderSuccessStep()}
                </AnimatePresence>
              </div>

              {currentStep !== 'success' && (
                <div className="flex justify-between pt-6 mt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={!canGoBack}
                    className={canGoBack ? '' : 'invisible'}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className={canGoNext ? 'gradient-primary' : 'invisible'}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
