import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WrestleStats',
  description: 'Wrestling statistics and analytics',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
