import { Smartphone, Download } from "lucide-react"

export function AppBanners() {
  return (
    <div className="w-full">
      {/* Mobile App Banners */}
      <div className="flex flex-col md:flex-row gap-0">
        <div className="flex-1 bg-blue-600 text-white py-3 px-6 flex items-center justify-center gap-3">
          <Download className="h-5 w-5" />
          <span className="font-medium">App en Google Play</span>
        </div>
        <div className="flex-1 bg-blue-700 text-white py-3 px-6 flex items-center justify-center gap-3">
          <Smartphone className="h-5 w-5" />
          <span className="font-medium">App en App Store</span>
        </div>
      </div>

      {/* VIP Banner */}
      <div className="bg-primary text-primary-foreground py-3 px-6 text-center">
        <span className="font-bold">💎 Hazte Miembro VIP</span>
      </div>
    </div>
  )
}
