import type { Metadata } from 'next'
import { Syne, Space_Mono } from 'next/font/google'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'Album Builder',
    template: '%s — Album Builder',
  },
  description: "Build a custom album from your favourite artist's full discography.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={`${syne.variable} ${spaceMono.variable}`}>
      <body className='min-h-screen antialiased'>{children}</body>
    </html>
  )
}
