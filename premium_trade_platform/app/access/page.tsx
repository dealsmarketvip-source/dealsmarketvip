"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ROIPresentation } from "@/app/components/roi-presentation"
import { useAuth } from "@/hooks/use-auth-instant"

export default function AccessPage() {
  const [showPresentation, setShowPresentation] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If user is already authenticated, redirect to marketplace
    if (user) {
      router.push('/marketplace')
    }
  }, [user, router])

  const handlePresentationComplete = () => {
    setShowPresentation(false)
    router.push('/marketplace')
  }

  if (!showPresentation) {
    return null
  }

  return <ROIPresentation onComplete={handlePresentationComplete} />
}
