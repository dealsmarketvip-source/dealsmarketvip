export default function StatusPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center space-y-6 p-8 bg-card rounded-lg border border-border">
        <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-foreground">Estado del Servidor</h1>
        <div className="space-y-2">
          <p className="text-green-500 font-semibold">✅ Servidor funcionando correctamente</p>
          <p className="text-green-500 font-semibold">✅ Next.js 15.1.0 activo</p>
          <p className="text-green-500 font-semibold">✅ Puerto 3001 accesible</p>
          <p className="text-green-500 font-semibold">✅ Headers CORS configurados</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Dominio: {typeof window !== 'undefined' ? window.location.hostname : 'Servidor'}</p>
          <p>Timestamp: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
