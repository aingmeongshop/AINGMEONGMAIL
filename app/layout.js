import './globals.css'
export const metadata = { title: 'AICENGMAIL' }
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-gray-900 bg-white">
        {children}
      </body>
    </html>
  )
}
