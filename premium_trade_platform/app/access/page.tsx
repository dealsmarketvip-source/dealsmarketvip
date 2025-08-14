"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ROIPresentation } from "@/app/components/roi-presentation"
import { useAuth } from "@/hooks/use-auth-instant"

export default function AccessPage() {
  const [showPresentation, setShowPresentation] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  // Removed auto-redirect to prevent fetch errors
  // Users will navigate manually through presentation

  const handlePresentationComplete = () => {
    setShowPresentation(false)
    window.location.href = '/marketplace'
  }

  if (!showPresentation) {
    return null
  }

  return <ROIPresentation onComplete={handlePresentationComplete} />
}
