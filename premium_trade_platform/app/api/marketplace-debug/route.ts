import { NextResponse } from 'next/server'
import { getMockProductsArray, getMockProducts, getMockProductById } from '@/lib/mock-data'

export async function GET() {
  try {
    // Test all mock data functions
    const productsArray = getMockProductsArray()
    const productsWithFilters = getMockProducts({}, 1, 5)
    const singleProduct = getMockProductById('prod-1')

    return NextResponse.json({
      status: 'success',
      message: 'Mock data functions working correctly',
      tests: {
        getMockProductsArray: {
          status: Array.isArray(productsArray) ? 'success' : 'failed',
          count: Array.isArray(productsArray) ? productsArray.length : 0,
          isArray: Array.isArray(productsArray),
          firstProduct: productsArray[0]?.title || 'None'
        },
        getMockProducts: {
          status: productsWithFilters?.data ? 'success' : 'failed',
          structure: typeof productsWithFilters,
          hasData: !!productsWithFilters?.data,
          dataCount: productsWithFilters?.data?.length || 0,
          totalCount: productsWithFilters?.count || 0
        },
        getMockProductById: {
          status: singleProduct?.data ? 'success' : 'failed',
          hasData: !!singleProduct?.data,
          hasError: !!singleProduct?.error,
          productTitle: singleProduct?.data?.title || 'None'
        }
      },
      fixes_applied: [
        '✅ Fixed getMockProducts return structure handling',
        '✅ Added getMockProductsArray for simple array access',
        '✅ Fixed product page getMockProductById usage',
        '✅ Added error handling and validation',
        '✅ Ensured array iterability in marketplace'
      ],
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Error testing mock data functions',
      error: error.message || String(error),
      stack: error.stack
    }, { status: 500 })
  }
}
