"use client"

import { useEffect } from 'react'

export default function DuplicateKeyDetector() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Override React's warning for duplicate keys to track where they're coming from
      const originalConsoleWarn = console.warn
      
      console.warn = (...args) => {
        const message = args[0]?.toString() || ''
        
        if (message.includes('Encountered two children with the same key')) {
          console.group('🔴 DUPLICATE KEY DETECTED!')
          console.error('Duplicate key warning:', message)
          console.trace('Stack trace:')
          console.groupEnd()
          
          // Try to extract the key from the message
          const keyMatch = message.match(/key,\s*`([^`]+)`/)
          if (keyMatch) {
            console.error(`❌ Duplicate key found: "${keyMatch[1]}"`)
          }
        }
        
        // Call original console.warn
        originalConsoleWarn(...args)
      }

      // Also override console.error for React warnings
      const originalConsoleError = console.error
      
      console.error = (...args) => {
        const message = args[0]?.toString() || ''
        
        if (message.includes('Warning: Encountered two children with the same key')) {
          console.group('🔴 DUPLICATE KEY ERROR!')
          console.error('React duplicate key error:', message)
          console.trace('Stack trace:')
          console.groupEnd()
          
          // Try to extract the key from the message
          const keyMatch = message.match(/key,\s*`([^`]+)`/)
          if (keyMatch) {
            console.error(`❌ Duplicate key found: "${keyMatch[1]}"`)
          }
        }
        
        // Call original console.error
        originalConsoleError(...args)
      }

      return () => {
        console.warn = originalConsoleWarn
        console.error = originalConsoleError
      }
    }
  }, [])

  return null
}
