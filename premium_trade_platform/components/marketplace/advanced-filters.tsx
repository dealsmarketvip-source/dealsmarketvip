
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Filter } from "lucide-react"

interface AdvancedFiltersProps {
  isOpen: boolean
  onClose: () => void
}

export function AdvancedFilters({ isOpen, onClose }: AdvancedFiltersProps) {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Filtros Avanzados</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Price Range */}
            <div className="space-y-4">
              <Label className="text-foreground font-semibold">Rango de Precio</Label>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Mínimo</Label>
                    <Input placeholder="€0" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Máximo</Label>
                    <Input placeholder="€1,000,000" className="mt-1" />
                  </div>
                </div>
                <Slider
                  defaultValue={[0, 100]}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label className="text-foreground font-semibold">Ubicación</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monaco">Mónaco</SelectItem>
                  <SelectItem value="switzerland">Suiza</SelectItem>
                  <SelectItem value="dubai">Dubai</SelectItem>
                  <SelectItem value="london">Londres</SelectItem>
                  <SelectItem value="paris">París</SelectItem>
                  <SelectItem value="newyork">Nueva York</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div className="space-y-4">
              <Label className="text-foreground font-semibold">Condición</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Nuevo", "Excelente", "Muy Bueno", "Bueno"].map((condition) => (
                  <Button
                    key={condition}
                    variant="outline"
                    className="justify-start h-auto p-3 text-left"
                  >
                    {condition}
                  </Button>
                ))}
              </div>
            </div>

            {/* Verified Sellers */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground font-semibold">Solo Vendedores Verificados</Label>
                <p className="text-sm text-muted-foreground">Proveedores con certificación elite</p>
              </div>
              <Switch defaultChecked />
            </div>

            {/* Urgent Requests */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground font-semibold">Búsquedas Urgentes</Label>
                <p className="text-sm text-muted-foreground">Oportunidades de alta prioridad</p>
              </div>
              <Switch />
            </div>

            {/* VIP Only */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground font-semibold">Solo Miembros VIP</Label>
                <p className="text-sm text-muted-foreground">Acceso exclusivo para elite</p>
              </div>
              <Switch />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancelar
              </Button>
              <Button className="flex-1 gradient-primary">
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
