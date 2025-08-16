export default function TestPage() {
  return (
    <div className="p-8">
      <h1>Simple Test Page</h1>
      <p>If you can see this, the server is working.</p>
      <p>Current time: {new Date().toISOString()}</p>
    </div>
  )
}
