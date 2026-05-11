'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Pie, PieChart, Tooltip } from 'recharts'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { TrackRow } from '@/components/track-row'
import { TrackPicker } from '@/components/track-picker'
import { RELEASE_DOT_COLORS } from '@/lib/colors'
import { BASE_TRACKS, SLOTS, type SlotOption, randomizeTracks } from '@/lib/data'
import { downloadAlbumImage } from '@/lib/download'

export default function Page() {
  const [selectedTracks, setSelectedTracks] = useState<SlotOption[]>(
    () => SLOTS.map((slot) => slot.options[0]),
  )
  const [pickerSlotIndex, setPickerSlotIndex] = useState<number | null>(null)
  const [isExtended, setIsExtended] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const didRandomize = useRef(false)

  useEffect(() => {
    if (didRandomize.current) return
    didRandomize.current = true
    setSelectedTracks((prev) => randomizeTracks(prev))
  }, [])

  const visibleSlots = isExtended ? SLOTS : SLOTS.slice(0, BASE_TRACKS)
  const visibleTracks = isExtended ? selectedTracks : selectedTracks.slice(0, BASE_TRACKS)

  const pickerSlot = pickerSlotIndex === null ? null : SLOTS[pickerSlotIndex]
  const pickerSelected = pickerSlotIndex === null ? null : selectedTracks[pickerSlotIndex]

  const handleSelect = (index: number, option: SlotOption) => {
    setSelectedTracks((prev) => {
      const next = [...prev]
      next[index] = option
      return next
    })
  }

  const chartData = useMemo(() => {
    const counts: Record<string, { name: string; value: number; fill: string }> = {}
    for (const track of visibleTracks) {
      if (!counts[track.releaseTitle]) {
        counts[track.releaseTitle] = {
          name: track.releaseTitle,
          value: 0,
          fill: RELEASE_DOT_COLORS[track.releaseTitle] ?? '#6b7280',
        }
      }
      counts[track.releaseTitle].value++
    }
    return Object.values(counts)
  }, [visibleTracks])

  return (
    <main
      className='min-h-screen'
      style={{ background: '#080810', fontFamily: 'var(--font-syne)' }}
    >
      <div className='mx-auto max-w-lg px-4 pb-16 pt-10 sm:px-6'>

        {/* header */}
        <header className='mb-6'>
          <h1 className='mb-4 text-2xl font-bold tracking-tight text-white'>
            Your Lights Album
          </h1>

          <div className='flex flex-wrap items-center gap-2'>
            <button
              type='button'
              onClick={() => setSelectedTracks((prev) => randomizeTracks(prev))}
              className='rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:bg-white/8 hover:text-white/80'
            >
              ↺ Shuffle 1–{BASE_TRACKS}
            </button>
            <button
              type='button'
              onClick={() => downloadAlbumImage(visibleTracks)}
              className='rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:bg-white/8 hover:text-white/80'
            >
              ↓ Save image
            </button>
            <button
              type='button'
              onClick={() => setShowChart(true)}
              className='rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:border-white/20 hover:bg-white/8 hover:text-white/80'
            >
              ◎ Distribution
            </button>

            <div className='ml-auto flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5'>
              <Switch
                id='extended'
                checked={isExtended}
                onCheckedChange={setIsExtended}
                className='data-unchecked:bg-white/25 data-checked:bg-teal-500'
              />
              <label
                htmlFor='extended'
                className={`cursor-pointer text-xs font-medium transition-colors ${isExtended ? 'text-teal-300' : 'text-white/50'}`}
              >
                EXTENDED
              </label>
            </div>
          </div>
        </header>

        {/* tracklist */}
        <div className='flex flex-col gap-1'>
          {visibleSlots.map((slot, i) => (
            <TrackRow
              key={slot.trackNumber}
              slot={slot}
              selected={selectedTracks[i]}
              onPick={() => setPickerSlotIndex(i)}
            />
          ))}
        </div>

        <div className='mt-5 px-1'>
          <span className='text-[10px] text-white/15'>⇄ = multiple versions available</span>
        </div>
      </div>

      {/* chart modal */}
      <Dialog open={showChart} onOpenChange={setShowChart}>
        <DialogContent className='border-white/10 bg-[#07080f] sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle
              className='text-white'
              style={{ fontFamily: 'var(--font-syne)' }}
            >
              Album Distribution
            </DialogTitle>
            <DialogDescription className='text-white/40'>
              Breakdown of your current tracklist by release
            </DialogDescription>
          </DialogHeader>

          <div className='flex flex-col items-center gap-4 pt-2'>
            <PieChart width={200} height={200}>
              <Pie
                data={chartData}
                dataKey='value'
                nameKey='name'
                cx='50%'
                cy='50%'
                innerRadius={52}
                outerRadius={92}
                paddingAngle={2}
                strokeWidth={0}
              />
              <Tooltip
                contentStyle={{
                  background: '#0f1020',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.8)',
                }}
                itemStyle={{ color: 'rgba(255,255,255,0.7)' }}
              />
            </PieChart>

            <div className='w-full space-y-1.5'>
              {chartData.map((entry) => (
                <div key={entry.name} className='flex items-center gap-2'>
                  <span
                    className='h-2 w-2 shrink-0 rounded-full'
                    style={{ background: entry.fill }}
                  />
                  <span className='text-xs text-white/50'>{entry.name}</span>
                  <span className='ml-auto font-mono text-xs text-white/30'>
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {pickerSlot && pickerSelected && (
        <TrackPicker
          open={pickerSlotIndex !== null}
          onClose={() => setPickerSlotIndex(null)}
          trackNumber={pickerSlot.trackNumber}
          options={pickerSlot.options}
          selected={pickerSelected}
          onSelect={(option) => handleSelect(pickerSlotIndex!, option)}
        />
      )}
    </main>
  )
}
