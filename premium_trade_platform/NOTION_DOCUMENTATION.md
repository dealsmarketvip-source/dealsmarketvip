# 📚 DOCUMENTACIÓN COMPLETA DEALSMARKET - NOTION WORKSPACE

Esta documentación está diseñada para ser copiada directamente a tu workspace de Notion. Organiza el contenido en las siguientes páginas:

---

## 🏠 **PÁGINA PRINCIPAL: DealsMarket - Plataforma B2B Premium**

### 🎯 **Misión**
Conectar empresas verificadas de Europa y Oriente Medio para facilitar transacciones comerciales de alto valor con total transparencia y seguridad.

### 📊 **Métricas Clave**
| Métrica | Objetivo Q1 2025 | Estado Actual |
|---------|------------------|---------------|
| Empresas Verificadas | 100 | 0 |
| Transacciones Mensuales | €50,000 | €0 |
| Productos Activos | 500 | 2 (demo) |
| Retención Usuarios | 85% | - |

### 🛠 **Stack Tecnológico**
- **Frontend**: Next.js 15.2.4, TypeScript, Tailwind CSS
- **UI/UX**: Framer Motion, Radix UI, shadcn/ui
- **Backend**: API Routes, JWT Authentication
- **Base de Datos**: Supabase (PostgreSQL)
- **Email**: Resend API
- **Pagos**: Stripe (€20/mes membresía)
- **Deployment**: Vercel

---

## 🚀 **PROYECTO - ROADMAP & DESARROLLO**

### ✅ **Fase 1: MVP Completado (Enero 2025)**
- [x] Sistema de autenticación OTP por email
- [x] Marketplace funcional con productos
- [x] Gestión de usuarios verificados
- [x] Páginas de navegación (Marketplace, Cuenta, Ajustes)
- [x] Sistema de favoritos
- [x] Formulario de venta de productos
- [x] UI/UX premium con efectos glow
- [x] Base de datos configurada

### 🔄 **Fase 2: Lanzamiento (Febrero 2025)**
- [ ] Integración de pagos Stripe completa
- [ ] Sistema de verificación KYC automático
- [ ] Dashboard de administrador
- [ ] Sistema de mensajería entre usuarios
- [ ] Notificaciones push y email
- [ ] SEO y optimización de rendimiento

### 🎯 **Fase 3: Crecimiento (Marzo-Abril 2025)**
- [ ] App móvil (React Native)
- [ ] Sistema de ratings y reviews
- [ ] Integración con APIs de verificación empresarial
- [ ] Soporte multiidioma (inglés, árabe)
- [ ] Analytics avanzados

---

## 👥 **EQUIPO**

### **Roles Actuales**
| Persona | Rol | Responsabilidades |
|---------|-----|-------------------|
| Fundador 1 | CEO/Product | Estrategia, desarrollo de producto |
| Fundador 2 | CTO/Dev | Desarrollo técnico, infraestructura |

### **Herramientas de Trabajo**
- **Desarrollo**: Builder.io, ChatGPT Plus Agent
- **Base de Datos**: Supabase
- **Email**: Resend
- **Pagos**: Stripe
- **Hosting**: Vercel
- **Gestión**: Notion (este workspace)

---

## 🏗 **ARQUITECTURA TÉCNICA**

### **Estructura del Proyecto**
```
premium_trade_platform/
├── app/                    # Páginas Next.js
│   ├── marketplace/        # Marketplace principal
│   ├── product/[id]/      # Páginas individuales de productos
│   ├── account/           # Gestión de cuenta
│   ├── settings/          # Configuración de usuario
│   ├── sell/              # Formulario de venta
│   └── api/               # API routes
│       └── auth/          # Autenticación
├── components/            # Componentes reutilizables
│   ├── ui/                # UI primitives
│   └── auth/              # Componentes de autenticación
├── hooks/                 # Custom React hooks
├── lib/                   # Utilidades y configuración
└── supabase/             # Migraciones de base de datos
```

### **Base de Datos (Supabase)**
#### Tablas Principales:
1. **login_codes**: Códigos OTP para autenticación
2. **users**: Usuarios verificados
3. **products**: Productos del marketplace
4. **user_favorites**: Sistema de favoritos

#### Políticas de Seguridad (RLS):
- Solo usuarios verificados pueden ver otros perfiles
- Los usuarios solo pueden gestionar sus propios productos
- Sistema de favoritos privado por usuario

---

## 🔐 **AUTENTICACIÓN & SEGURIDAD**

### **Flujo de Autenticación OTP**
1. Usuario introduce email
2. Sistema genera código de 6 dígitos
3. Código enviado por Resend con plantilla premium
4. Usuario introduce código (válido 10 minutos)
5. Sistema crea/actualiza cuenta automáticamente
6. JWT token almacenado en cookie HTTP-only

### **Configuración de Seguridad**
- Rate limiting: 5 intentos por 15 minutos
- Códigos expiran en 10 minutos
- JWT tokens válidos 7 días
- Row Level Security en todas las tablas
- Cookies seguras en producción

### **Variables de Entorno Requeridas**
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role

# Resend Email
RESEND_API_KEY=re_tu_clave_resend
RESEND_FROM=noreply@dealsmarket.com

# Authentication
AUTH_SECRET=dealsmarket_super_secret_jwt_key_2024_premium

# URLs
NEXT_PUBLIC_SITE_URL=https://dealsmarket.vercel.app
```

---

## 💼 **MODELO DE NEGOCIO**

### **Ingresos**
- **Membresía Premium**: €20/mes por empresa verificada
- **Comisión por transacción**: 2% (futuro)
- **Servicios premium**: Verificación express, destacados

### **Propuesta de Valor**
1. **Para Vendedores**:
   - Acceso a red verificada de compradores
   - Herramientas profesionales de venta
   - Soporte prioritario
   
2. **Para Compradores**:
   - Solo empresas verificadas
   - Productos de calidad garantizada
   - Transacciones seguras

### **Mercado Objetivo**
- **Región**: Europa y Oriente Medio
- **Tipo**: Empresas B2B verificadas
- **Volumen**: Transacciones de €1,000+
- **Sectores**: Electrónicos, maquinaria, materias primas

---

## 📋 **PROCESOS OPERATIVOS**

### **Verificación de Empresas (KYC)**
1. **Documentos Requeridos**:
   - Registro mercantil
   - CIF/NIF empresarial
   - Identificación del representante legal
   - Comprobante de domicilio fiscal

2. **Proceso de Verificación**:
   - Revisión automática inicial
   - Verificación manual (24-48h)
   - Aprobación/rechazo con feedback
   - Badge de verificación en perfil

### **Gestión de Productos**
- Máximo 5 productos activos por empresa
- Revisión de calidad obligatoria
- Imágenes profesionales requeridas
- Descripción detallada obligatoria

### **Soporte al Cliente**
- **Horario**: L-V 9:00-18:00 CET
- **Canales**: Email, chat interno
- **SLA**: 24h respuesta, 72h resolución
- **Idiomas**: Español, inglés

---

## 📊 **ANALYTICS & KPIs**

### **Métricas de Producto**
- Daily/Monthly Active Users (DAU/MAU)
- Conversion rate: visita → registro
- Conversion rate: registro → membresía
- Tiempo en plataforma
- Productos publicados por usuario

### **Métricas de Negocio**
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Churn rate mensual
- Volumen de transacciones

### **Métricas Técnicas**
- Page load speed
- API response time
- Error rate
- Uptime (objetivo: 99.9%)

---

## 🎨 **BRAND & DISEÑO**

### **Identidad Visual**
- **Colores Primarios**: 
  - Azul Marino (#0A1628) - Confianza y profesionalismo
  - Oro (#F59E0B) - Exclusividad y premium
- **Tipografía**: Inter (UI), Playfair Display (títulos)
- **Estilo**: Minimalista, premium, profesional

### **Componentes UI**
- Efectos glow en elementos interactivos
- Animaciones suaves con Framer Motion
- Gradientes sutiles
- Iconografía coherente (Lucide React)

### **Experiencia de Usuario**
- Loading states en todas las acciones
- Feedback inmediato en formularios
- Navegación intuitiva
- Responsive design

---

## 🐛 **DEBUGGING & SOLUCIÓN DE PROBLEMAS**

### **Problemas Comunes**

#### **Error de Autenticación**
```
Síntoma: Usuario no puede iniciar sesión
Diagnóstico: 
1. Verificar variables de entorno Resend
2. Comprobar límites de rate limiting
3. Verificar conexión Supabase
Solución: Revisar logs en Vercel y Supabase
```

#### **Productos no se cargan**
```
Síntoma: Marketplace vacío o errores
Diagnóstico:
1. Verificar configuración Supabase
2. Comprobar políticas RLS
3. Verificar datos demo
Solución: El sistema tiene fallback a datos demo automáticamente
```

#### **Emails no se envían**
```
Síntoma: Códigos OTP no llegan
Diagnóstico:
1. Verificar RESEND_API_KEY
2. Comprobar límites de Resend
3. Verificar spam/promociones
Solución: Logs en dashboard de Resend
```

### **Monitoreo**
- **Vercel Analytics**: Rendimiento y errores
- **Supabase Dashboard**: Queries y rendimiento DB
- **Resend Dashboard**: Entrega de emails

---

## 🚀 **DEPLOYMENT & CI/CD**

### **Proceso de Deploy**
1. **Desarrollo Local**:
   ```bash
   npm run dev
   # Desarrollo en localhost:3000
   ```

2. **Staging** (automático en push a `staging`):
   - URL: https://dealsmarket-staging.vercel.app
   - Base de datos: Supabase staging

3. **Producción** (manual desde `main`):
   - URL: https://dealsmarket.vercel.app
   - Base de datos: Supabase production

### **Variables por Entorno**
| Variable | Desarrollo | Staging | Producción |
|----------|------------|---------|------------|
| NEXT_PUBLIC_SITE_URL | localhost:3000 | staging URL | production URL |
| SUPABASE_URL | demo/local | staging DB | production DB |
| RESEND_API_KEY | test key | test key | production key |

---

## 📚 **DOCUMENTACIÓN TÉCNICA**

### **APIs Disponibles**

#### **Autenticación**
- `POST /api/auth/send-login-code` - Enviar código OTP
- `POST /api/auth/verify-login-code` - Verificar código
- `POST /api/auth/logout` - Cerrar sesión

#### **Productos**
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `PUT /api/products/[id]` - Actualizar producto
- `DELETE /api/products/[id]` - Eliminar producto

#### **Usuarios**
- `GET /api/users/profile` - Obtener perfil
- `PUT /api/users/profile` - Actualizar perfil
- `POST /api/users/favorites` - Gestionar favoritos

### **Hooks Personalizados**
- `useAuth()` - Estado de autenticación
- `usePageLoading()` - Loading states
- `useToast()` - Notificaciones

---

## 📞 **CONTACTO & ESCALACIÓN**

### **Soporte Técnico**
- **Email**: tech@dealsmarket.com
- **Incidencias**: Notion task board
- **Urgente**: WhatsApp del equipo

### **Contacto Comercial**
- **Email**: hello@dealsmarket.com
- **LinkedIn**: [DealsMarket Official]
- **Teléfono**: +34 XXX XXX XXX

---

## 📝 **NOTAS IMPORTANTES**

### **Recordatorios para el Equipo**
1. ✅ **Variables de entorno configuradas**
2. ✅ **Base de datos lista para producción**
3. ✅ **Sistema de emails configurado**
4. ⚠️ **Pendiente**: Configurar claves reales de Supabase y Resend
5. ⚠️ **Pendiente**: Deploy a Vercel con dominio personalizado

### **Próximos Pasos Críticos**
1. Ejecutar migraciones SQL en Supabase producción
2. Configurar dominio dealsmarket.com
3. Configurar Resend con dominio personalizado
4. Hacer deploy final a Vercel
5. Testing completo del flujo de usuario

---

*📅 Última actualización: Enero 2025*
*👥 Actualizado por: Equipo DealsMarket*
*🔄 Próxima revisión: Febrero 2025*
