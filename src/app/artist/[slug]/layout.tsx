import type { Metadata } from 'next'
import { getArtist } from '@/lib/artists'

interface LayoutProps {
  readonly params: Promise<{ slug: string }>
  readonly children: React.ReactNode
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { slug } = await params
  const entry = getArtist(slug)
  return { title: entry?.artist.name ?? 'Artist' }
}

export default function ArtistLayout({ children }: LayoutProps) {
  return <>{children}</>
}
