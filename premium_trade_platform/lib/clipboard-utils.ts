// Clipboard utilities with fallback for environments where Clipboard API is blocked

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (error) {
    console.warn('Clipboard API failed, trying fallback method:', error)
  }

  // Fallback method using execCommand (deprecated but more compatible)
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    const successful = document.execCommand('copy')
    document.body.removeChild(textArea)
    
    return successful
  } catch (error) {
    console.error('Both clipboard methods failed:', error)
    return false
  }
}

export async function readFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText()
    }
  } catch (error) {
    console.warn('Clipboard read failed:', error)
  }
  
  // No reliable fallback for reading from clipboard
  return null
}

// Check if clipboard API is available
export function isClipboardSupported(): boolean {
  return !!(navigator.clipboard && navigator.clipboard.writeText)
}

// Monkey patch the global clipboard API to use our fallback
if (typeof window !== 'undefined') {
  // Override the native clipboard API with our fallback version
  const originalWriteText = navigator.clipboard?.writeText
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText = async function(text: string) {
      try {
        if (originalWriteText) {
          return await originalWriteText.call(this, text)
        }
      } catch (error) {
        // Use our fallback
        const success = await copyToClipboard(text)
        if (!success) {
          throw new Error('Failed to copy to clipboard')
        }
      }
    }
  }
}
