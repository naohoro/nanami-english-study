import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '七海の英語アプリ',
  description: '共通テスト英語を最短で攻略する',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${geist.className} min-h-screen`} style={{ background: 'var(--cream)', color: '#1A1A1A' }}>
        <div className="max-w-md md:max-w-xl lg:max-w-2xl mx-auto min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  )
}
