"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestErrorsPage() {
  const [showResizeObserverTest, setShowResizeObserverTest] = useState(false)

  const triggerResizeObserverLoop = () => {
    // This simulates a ResizeObserver loop scenario
    const div = document.createElement('div')
    div.style.width = '100px'
    div.style.height = '100px'
    document.body.appendChild(div)

    // Create a ResizeObserver that will trigger the loop warning
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Trigger layout recalculation during resize observation
        entry.target.style.width = entry.contentRect.width + 1 + 'px'
      }
    })

    observer.observe(div)
    
    // Clean up after 2 seconds
    setTimeout(() => {
      observer.disconnect()
      document.body.removeChild(div)
      setShowResizeObserverTest(false)
    }, 2000)
  }

  const triggerNullError = () => {
    // This will trigger the error boundary with a null error
    try {
      throw null
    } catch (error) {
      console.error('Testing null error:', error)
    }
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Error Testing Page</h1>
      <p className="text-gray-600">
        This page is for testing error handling and suppression.
      </p>
      
      <div className="space-y-4">
        <Button 
          onClick={triggerResizeObserverLoop}
          disabled={showResizeObserverTest}
          variant="outline"
        >
          {showResizeObserverTest ? 'Testing ResizeObserver...' : 'Test ResizeObserver Loop'}
        </Button>
        
        <Button 
          onClick={triggerNullError}
          variant="outline"
        >
          Test Null Error
        </Button>
        
        <p className="text-sm text-gray-500">
          Check the browser console for suppressed errors. These should now be handled gracefully.
        </p>
      </div>
    </div>
  )
}
