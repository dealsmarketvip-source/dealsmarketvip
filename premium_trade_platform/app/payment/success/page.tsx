import { Suspense } from "react"
import PaymentSuccessClient from "./payment-success-client"
import { CrownLogo } from "@/components/ui/crown-logo"

function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin">
          <CrownLogo size="lg" className="text-primary mx-auto" animated={false} />
        </div>
        <h2 className="text-xl font-semibold text-foreground">
          Cargando página de éxito...
        </h2>
        <p className="text-muted-foreground">
          Verificando tu suscripción
        </p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessClient />
    </Suspense>
  )
}
