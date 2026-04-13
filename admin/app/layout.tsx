import type { Metadata } from 'next'
import './globals.css'
import { SupabaseProvider } from '@/components/providers/SupabaseProvider'
import { RpgContextProvider } from '@/components/providers/RpgContextProvider'

export const metadata: Metadata = {
  title: 'Lapse Admin',
  description: 'Admin panel for Lapse RPG',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          <RpgContextProvider>
            {children}
          </RpgContextProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
