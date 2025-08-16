import Image from "next/image"

export function SocialProof() {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground mb-8">
          Confiado por empresas líderes
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-50">
          {/* Placeholder logos */}
          <div className="h-12 bg-muted rounded flex items-center justify-center">
            Logo 1
          </div>
          <div className="h-12 bg-muted rounded flex items-center justify-center">
            Logo 2
          </div>
          <div className="h-12 bg-muted rounded flex items-center justify-center">
            Logo 3
          </div>
          <div className="h-12 bg-muted rounded flex items-center justify-center">
            Logo 4
          </div>
        </div>
      </div>
    </div>
  )
}
