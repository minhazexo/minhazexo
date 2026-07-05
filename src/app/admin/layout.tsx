import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | MD Mehrab Hossain',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
