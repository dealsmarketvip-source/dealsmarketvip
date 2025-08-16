'use client'

import { useEffect } from 'react'

export default function ClipboardFix() {
  useEffect(() => {
    // Monkey patch clipboard API before Next.js dev overlay loads
    if (typeof window !== 'undefined' && navigator.clipboard) {
      const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard)
      
      navigator.clipboard.writeText = async function(text: string) {
        try {
          return await originalWriteText(text)
        } catch (error: any) {
          // Fallback to execCommand for environments where clipboard API is blocked
          console.warn('Clipboard API blocked, using fallback:', error.message)
          
          try {
            const textArea = document.createElement('textarea')
            textArea.value = text
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            textArea.style.top = '-999999px'
            textArea.style.opacity = '0'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            
            const successful = document.execCommand('copy')
            document.body.removeChild(textArea)
            
            if (!successful) {
              throw new Error('execCommand failed')
            }
            
            return Promise.resolve()
          } catch (fallbackError) {
            console.error('Both clipboard methods failed:', fallbackError)
            // Don't throw - just fail silently for dev overlay
            return Promise.reject(new Error('Clipboard access denied'))
          }
        }
      }
    }
  }, [])

  return null
}
