// src/app/layout.tsx - Root Layout for App Router
import type { Metadata } from 'next'
import Layout from '../components/Layout'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nederlandse Bond der Clubs - Croquet Nederland',
  description: 'The premier croquet organisation of the Netherlands, established 1898',
  keywords: ['croquet', 'nederland', 'sport', 'clubs', 'tournament'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}