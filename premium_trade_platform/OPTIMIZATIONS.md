# DealsMarket - Optimizaciones de Rendimiento y Experimentación

## 🚀 Resumen de Optimizaciones Implementadas

Este documento detalla todas las optimizaciones de rendimiento y preparación para experimentación implementadas en DealsMarket B2B platform.

## 📈 Optimizaciones de Rendimiento

### 1. Vercel Analytics + Speed Insights
- **Archivos**: `app/layout.tsx`
- **Componentes**: `Analytics`, `SpeedInsights`
- **Beneficios**: Monitoreo en tiempo real de Core Web Vitals y métricas de usuario

### 2. Optimización de Imágenes con Next.js
- **Archivos**: `next.config.mjs`, `components/optimized-image.tsx`
- **Configuración**: Remote patterns para CDNs, lazy loading automático
- **Beneficios**: Reducción de hasta 75% en tamaño de imágenes

### 3. Lazy Loading de Componentes
- **Archivos**: `app/page.tsx`
- **Implementación**: `React.lazy()` para componentes pesados
- **Beneficios**: Reducción de bundle inicial y tiempo de carga

### 4. Caching de Contenido Inteligente
- **Archivos**: `lib/content-cache.ts`
- **Estrategias**:
  - Contenido estático: 300 segundos
  - Contenido dinámico: 60 segundos  
  - Contenido en tiempo real: 30 segundos
- **Beneficios**: Reducción de llamadas a API y mejora de UX

## 🔍 Analytics y Monitoreo

### 1. Sistema de Analytics Personalizado
- **Archivos**: `lib/analytics.ts`
- **Funciones**:
  - `trackView()`: Seguimiento de páginas vistas
  - `trackClick()`: Seguimiento de clics en elementos
  - `trackPurchase()`: Seguimiento de conversiones
- **Integración**: Vercel Analytics + eventos personalizados

### 2. Monitoreo de Errores con Sentry
- **Archivos**: 
  - `sentry.client.config.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`
  - `instrumentation.ts`
- **Características**:
  - Session Replay habilitado
  - Filtrado de errores sensibles
  - Sampling rates optimizados
  - Integración con Vercel

### 3. Lighthouse CI
- **Archivos**: `.lighthouserc.js`
- **Budgets**:
  - Performance: >80%
  - Accessibility: >90%
  - Best Practices: >90%
  - SEO: >90%
- **Métricas clave**: FCP, LCP, CLS, FID bajo 2s/4s/0.1/100ms

## 🧪 Preparación para Experimentación

### 1. Feature Flags con GrowthBook
- **Archivos**: `lib/experiments.ts`, `middleware.ts`
- **Características**:
  - A/B testing server-side y client-side
  - Feature flags dinámicos
  - Segmentación de usuarios
  - Edge middleware para experimentos

### 2. Búsqueda con Algolia (Preparado)
- **Archivos**: `lib/search.ts`
- **Funcionalidades**:
  - Indexación automática de contenido
  - Webhooks para sincronización
  - Búsqueda facetada y filtros
  - Preparado para activación inmediata

### 3. Edge Middleware
- **Archivos**: `middleware.ts`
- **Funciones**:
  - Resolución de experimentos en edge
  - Headers personalizados para A/B testing
  - Cookies de consistencia de experimentos

## 🛠️ Configuración de Variables de Entorno

```bash
# Analytics y Monitoreo
VERCEL_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id

# Sentry
SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
SENTRY_AUTH_TOKEN=your_sentry_auth_token

# GrowthBook
GROWTHBOOK_API_HOST=https://cdn.growthbook.io
NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY=your_client_key
GROWTHBOOK_DECRYPTION_KEY=your_decryption_key

# Algolia (Opcional)
ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_API_KEY=your_algolia_admin_key
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_key
ALGOLIA_INDEX_NAME=dealsmarket_content
```

## 📊 Métricas de Mejora Esperadas

### Performance
- **Bundle Size**: Reducción de ~30% con lazy loading
- **LCP**: Mejora de 2-3 segundos con optimización de imágenes
- **FCP**: Mejora de 1-2 segundos con caching
- **CLS**: Reducción de layout shifts con dimensiones fijas

### User Experience  
- **Page Load**: Reducción de 40-60% en tiempo de carga
- **Image Load**: Reducción de 75% con Next.js Image
- **Cache Hit Rate**: 80-90% para contenido estático

### Monitoreo
- **Error Detection**: 99.9% de errores capturados con Sentry
- **Real User Monitoring**: Métricas de todos los usuarios reales
- **Performance Insights**: Análisis detallado de Core Web Vitals

## 🔧 Scripts de Desarrollo

```bash
# Desarrollo con optimizaciones
npm run dev

# Build optimizado
npm run build

# Lighthouse CI
npm run lighthouse

# Start production
npm run start
```

## 🚦 Lighthouse CI Budgets

El proyecto incluye configuración automática de Lighthouse CI con los siguientes budgets:

- **Performance**: Mínimo 80%
- **Accessibility**: Mínimo 90%  
- **Best Practices**: Mínimo 90%
- **SEO**: Mínimo 90%

### Métricas Específicas:
- **First Contentful Paint**: < 2.0s
- **Largest Contentful Paint**: < 4.0s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Speed Index**: < 3.0s
- **Total Blocking Time**: < 300ms

## 📝 Uso de Analytics

### Tracking de Páginas
```typescript
import { analytics } from '@/lib/analytics'

// En useEffect
useEffect(() => {
  analytics.trackView('page_name', { 
    custom_properties: 'value' 
  });
}, []);
```

### Tracking de Eventos
```typescript
const handleClick = () => {
  analytics.trackClick('button_name', {
    location: 'header',
    user_type: 'premium'
  });
  // ... resto de la lógica
};
```

### Tracking de Conversiones
```typescript
analytics.trackPurchase({
  product_id: 'abc123',
  value: 99.99,
  currency: 'EUR'
});
```

## 🎯 Feature Flags

### Uso Básico
```typescript
import { useFeatureFlag } from '@/lib/experiments'

function MyComponent() {
  const showNewFeature = useFeatureFlag('new-feature', false);
  
  return (
    <div>
      {showNewFeature && <NewFeature />}
    </div>
  );
}
```

### Configuración de Experimentos
```typescript
// En GrowthBook dashboard
{
  "new-checkout": {
    "enabled": true,
    "traffic": 0.5, // 50% de usuarios
    "targeting": {
      "country": "ES"
    }
  }
}
```

## 🔍 Debugging y Monitoreo

### Sentry Dashboard
- Errores en tiempo real
- Performance monitoring
- Session replay para UX issues
- Release tracking

### Vercel Analytics
- Core Web Vitals
- Real User Monitoring
- Geographic performance data
- Device/browser breakdown

### Lighthouse CI
- Automated performance testing
- Regression detection
- Performance budgets
- CI/CD integration

## 🚀 Próximos Pasos

1. **Configurar variables de entorno** según necesidades
2. **Activar Algolia** cuando sea necesario para búsqueda avanzada
3. **Configurar experimentos** en GrowthBook dashboard
4. **Monitorear métricas** en Sentry y Vercel Analytics
5. **Iterar optimizaciones** basado en datos reales

## 🤝 Soporte

Para preguntas sobre las optimizaciones implementadas:
- Revisar logs de Sentry para errores
- Consultar Vercel Analytics para métricas
- Ejecutar `npm run lighthouse` para auditorías locales
- Verificar variables de entorno están configuradas

## 📋 Checklist de Activación

- [ ] Configurar variables de entorno de Sentry
- [ ] Configurar variables de entorno de GrowthBook  
- [ ] Activar Algolia (opcional)
- [ ] Verificar métricas en Vercel Analytics
- [ ] Configurar alerts en Sentry
- [ ] Ejecutar primera auditoría con Lighthouse CI
