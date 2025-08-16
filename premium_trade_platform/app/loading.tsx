import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <LoadingSpinner size="lg" variant="default" />
        <p className="text-gray-300 mt-4">Loading...</p>
      </div>
    </div>
  )
}
