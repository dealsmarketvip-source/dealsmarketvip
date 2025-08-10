"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestDBPage() {
  const [products, setProducts] = useState<any[]>([])
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setError("")
    
    try {
      const supabase = createClient()
      
      console.log("Testing Supabase connection...")
      
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, category')
        .limit(3)

      if (error) {
        throw error
      }

      console.log("Products loaded:", data)
      setProducts(data || [])
      
    } catch (err: any) {
      console.error("Connection error:", err)
      setError(err.message || JSON.stringify(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Supabase Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testConnection} disabled={loading}>
              {loading ? "Testing..." : "Test Connection"}
            </Button>
            
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            {products.length > 0 && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                <strong>Success!</strong> Loaded {products.length} products
                <pre className="mt-2 text-sm">
                  {JSON.stringify(products, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
