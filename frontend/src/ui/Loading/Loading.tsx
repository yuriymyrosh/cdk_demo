export function Loading() {
  return <div className="min-h-screen flex items-center justify-center">
    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600" role="status">
      <span className="hidden">Loading...</span>
    </div>
  </div>
}
