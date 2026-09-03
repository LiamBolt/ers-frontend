export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ers-bg p-4 relative overflow-hidden">
      <div className="bg-blobs" aria-hidden="true" />
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}