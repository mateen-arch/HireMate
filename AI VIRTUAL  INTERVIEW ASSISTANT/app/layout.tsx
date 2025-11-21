import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Virtual Interview Assistant',
  description: 'AI-powered virtual interview assistant with voice interaction and real-time feedback',
  keywords: ['AI', 'Interview', 'Assistant', 'Voice', 'Grok AI', 'AssemblyAI'],
  authors: [{ name: 'AI Interview Assistant Team' }],
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}




