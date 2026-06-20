export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AICENGMAIL</h1>
        <p className="text-gray-600 mb-6">Admin dashboard for your custom domain mailboxes.</p>
        <a href="/admin" className="px-5 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
          Go to Admin
        </a>
      </div>
    </main>
  )
}
