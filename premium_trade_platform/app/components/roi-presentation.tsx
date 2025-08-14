"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, Users, Target } from "lucide-react"

interface ROIPresentationProps {
  onComplete: () => void
}

export function ROIPresentation({ onComplete }: ROIPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)

  const slides = [
    {
      title: "Bienvenido a Tu Plataforma de Trading Premium",
      description: "Descubre cómo maximizar tu retorno de inversión",
      icon: <TrendingUp className="h-12 w-12 text-primary" />,
      content: "Tu acceso premium te brinda herramientas avanzadas para optimizar tus inversiones y maximizar tus ganancias."
    },
    {
      title: "Análisis de ROI Personalizado",
      description: "Métricas que importan para tu éxito",
      icon: <DollarSign className="h-12 w-12 text-primary" />,
      content: "Accede a análisis detallados de rendimiento, proyecciones de ganancia y métricas personalizadas para tu cartera."
    },
    {
      title: "Comunidad Exclusiva",
      description: "Conecta con traders exitosos",
      icon: <Users className="h-12 w-12 text-primary" />,
      content: "Únete a una comunidad selecta de traders premium. Comparte estrategias y aprende de los mejores."
    },
    {
      title: "Herramientas Avanzadas",
      description: "Todo lo que necesitas para triunfar",
      icon: <Target className="h-12 w-12 text-primary" />,
      content: "Alertas inteligentes, análisis técnico avanzado, y acceso prioritario a nuevas oportunidades de inversión."
    }
  ]

  useEffect(() => {
    setProgress(((currentSlide + 1) / slides.length) * 100)
  }, [currentSlide, slides.length])

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="mb-6">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {currentSlide + 1} de {slides.length}
          </p>
        </div>

        <Card className="animate-fade-in">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {slides[currentSlide].icon}
            </div>
            <CardTitle className="text-2xl md:text-3xl">
              {slides[currentSlide].title}
            </CardTitle>
            <CardDescription className="text-lg">
              {slides[currentSlide].description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-muted-foreground mb-8">
              {slides[currentSlide].content}
            </p>
            
            <div className="flex justify-between gap-4">
              <Button 
                variant="outline" 
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="flex-1"
              >
                Anterior
              </Button>
              <Button 
                onClick={nextSlide}
                className="flex-1"
              >
                {currentSlide === slides.length - 1 ? "Comenzar" : "Siguiente"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
