import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Crown, Sparkles, ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function StaticLandingPage() {
  const categories = [
    { name: "Artículos de Lujo", icon: "💎" },
    { name: "Vehículos Clásicos", icon: "🏎️" },
    { name: "Inmuebles Premium", icon: "🏛️" },
    { name: "Arte y Coleccionables", icon: "🎨" },
    { name: "Negocios en Venta", icon: "🏢" },
    { name: "Servicios Especializados", icon: "⚡" },
    { name: "Tecnología Avanzada", icon: "🚀" },
    { name: "Experiencias Únicas", icon: "✨" },
  ]

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pb-0">
      <div className="relative z-10">
        <main className="relative">
          <section className="flex flex-col items-center relative mx-auto overflow-hidden min-h-screen">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full relative z-10">
              {/* Header */}
              <header className="w-full py-6 px-6 bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-8">
                      <div className="flex flex-col items-start">
                        <span className="text-foreground text-2xl font-bold tracking-wider gradient-text">BRIDGEZONE</span>
                        <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">EL MARKETPLACE BUSCADO</span>
                      </div>
                      <nav className="hidden md:flex items-center gap-2">
                        <a className="text-muted-foreground hover:text-primary px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-muted/50" href="#marketplace">Marketplace</a>
                        <a className="text-muted-foreground hover:text-primary px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-muted/50" href="#servicios">Servicios</a>
                        <a className="text-muted-foreground hover:text-primary px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-muted/50" href="#vip">VIP</a>
                      </nav>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button className="gradient-primary text-primary-foreground hover:scale-105 px-6 py-2 rounded-full font-medium shadow-lg transition-all duration-300 glow-primary">
                        Registrarse
                      </Button>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-0 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg">
                      <Select>
                        <SelectTrigger className="w-[160px] bg-card border-0 rounded-none h-14 text-foreground">
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="luxury">Artículos de Lujo</SelectItem>
                          <SelectItem value="vehicles">Vehículos</SelectItem>
                          <SelectItem value="real-estate">Inmuebles</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative flex-1">
                        <Input
                          className="border-0 rounded-none h-14 bg-card text-foreground placeholder:text-muted-foreground focus:ring-0 focus:ring-offset-0"
                          placeholder="¿Qué estás buscando?"
                        />
                      </div>
                      <Button className="h-14 px-6 gradient-primary rounded-none hover:scale-105 transition-all duration-300">
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </header>
            </div>

            {/* VIP Banner */}
            <div className="w-full gradient-primary py-4 px-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 left-10">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="absolute top-1 right-20">
                  <Crown className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 relative z-10">
                <Crown className="h-6 w-6 text-primary-foreground" />
                <span className="text-primary-foreground font-bold text-lg">
                  Hazte Miembro VIP y destaca tus búsquedas
                </span>
                <Button variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-all duration-300">
                  Más Info
                </Button>
              </div>
            </div>

            {/* Hero Content */}
            <div className="w-full flex-1 py-20 px-4 relative z-10">
              <div className="max-w-6xl mx-auto text-center">
                <div className="mb-12">
                  <h1 className="text-foreground text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    ¿QUÉ ESTÁS <span className="gradient-text inline-block">BUSCANDO?</span>
                  </h1>
                  <div className="mb-8">
                    <img
                      src="/images/hero-marketplace.png"
                      alt="BridgeZone Marketplace"
                      className="w-full max-w-4xl mx-auto rounded-3xl shadow-2xl border border-border/20"
                    />
                  </div>
                  <p className="text-muted-foreground text-xl md:text-2xl max-w-3xl mx-auto">
                    El primer marketplace donde publicas lo que necesitas y los vendedores te encuentran
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                  <Link href="#publicar-busqueda">
                    <Button className="group gradient-primary text-primary-foreground hover:scale-105 px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300 glow-primary">
                      <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                      Publicar Búsqueda
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#ofrecer-servicio">
                    <Button className="group bg-accent hover:bg-accent/90 text-accent-foreground hover:scale-105 px-10 py-4 rounded-2xl font-semibold text-lg shadow-2xl transition-all duration-300">
                      <TrendingUp className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Ofrecer Servicio
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
                  {categories.map((category, index) => (
                    <div key={`static-category-${index}`}>
                      <Button
                        variant="outline"
                        className="group gradient-card hover:bg-card/80 text-foreground border-border/50 hover:border-primary/50 py-8 px-6 rounded-2xl font-medium text-sm h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg bg-transparent"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-2xl group-hover:scale-110 transition-transform">{category.icon}</span>
                          <span className="leading-tight">{category.name}</span>
                        </div>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
