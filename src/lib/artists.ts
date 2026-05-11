import type { Release } from '@/lib/data'
import lightsData from '../../data/lights-cmad4p7n2k9q1m3r8s6t0v5w.json'

export interface ArtistMeta {
  id: string
  name: string
  slug: string
  genre: string
  origin: string
  born?: string
}

export interface ArtistEntry {
  artist: ArtistMeta
  releases: Release[]
}

const registry: Record<string, ArtistEntry> = {
  'lights-cmad4p7n2k9q1m3r8s6t0v5w': lightsData as unknown as ArtistEntry,
}

export function getArtist(slug: string): ArtistEntry | null {
  return registry[slug] ?? null
}

export const ALL_ARTISTS: ArtistMeta[] = Object.values(registry).map((e) => e.artist)
