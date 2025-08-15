// Utility to handle fetch errors gracefully, especially in development
export async function safeFetch(
  url: string, 
  options?: RequestInit,
  retries: number = 1
): Promise<Response | null> {
  try {
    const response = await fetch(url, options)
    return response
  } catch (error) {
    console.warn(`Fetch failed for ${url}:`, error)
    
    // Retry logic for network errors
    if (retries > 0 && error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.log(`Retrying fetch for ${url} (${retries} retries left)`)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return safeFetch(url, options, retries - 1)
    }
    
    // Don't throw for HMR-related fetches in development
    if (process.env.NODE_ENV === 'development' && url.includes('/_next/')) {
      console.warn('HMR fetch error suppressed in development')
      return null
    }
    
    throw error
  }
}

// Wrapper for API calls with better error handling
export async function apiCall<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await safeFetch(`/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
    
    if (!response) {
      return { data: null, error: 'Network error - request failed' }
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
      return { data: null, error: errorData.message || `HTTP ${response.status}` }
    }
    
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    console.error('API call failed:', error)
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}
