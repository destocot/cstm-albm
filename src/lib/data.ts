export interface Release {
  id: string
  title: string
  type: 'ep' | 'album'
  year: number
  cover?: string
  collaborators?: string[]
  tracks: Array<{ trackNumber: number; title: string; note?: string }>
}

export interface SlotOption {
  trackNumber: number
  title: string
  releaseId: string
  releaseTitle: string
  releaseYear: number
  releaseType: string
  releaseCover?: string
  collaborators?: string[]
}

export interface Slot {
  trackNumber: number
  options: SlotOption[]
}

export const BASE_TRACKS = 15

export function buildSlots(releases: Release[]): Slot[] {
  const max = Math.max(0, ...releases.flatMap((r) => r.tracks.map((t) => t.trackNumber)))
  return Array.from({ length: max }, (_, i) => {
    const trackNum = i + 1
    const options: SlotOption[] = []

    for (const release of releases) {
      const track = release.tracks.find((t) => t.trackNumber === trackNum)
      if (track) {
        options.push({
          trackNumber: trackNum,
          title: track.title,
          releaseId: release.id,
          releaseTitle: release.title,
          releaseYear: release.year,
          releaseType: release.type,
          releaseCover: release.cover,
          collaborators: release.collaborators,
        })
      }
    }

    return { trackNumber: trackNum, options }
  })
}

export function randomizeTracks(slots: Slot[], current: SlotOption[]): SlotOption[] {
  return slots.map((slot, i) => {
    const isRandomizable = i < BASE_TRACKS && slot.options.length > 1
    if (!isRandomizable) return current[i]
    return slot.options[Math.floor(Math.random() * slot.options.length)]
  })
}
