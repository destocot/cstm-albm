'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { BADGE_COLORS } from '@/lib/colors'
import type { Slot, SlotOption } from '@/lib/data'

interface TrackRowProps {
  slot: Slot
  selected: SlotOption
  onPick: () => void
}

export const TrackRow = ({ slot, selected, onPick }: TrackRowProps) => {
  const isMulti = slot.options.length > 1
  const colors = BADGE_COLORS[selected.releaseTitle] ?? {
    bg: 'bg-zinc-800/60',
    text: 'text-zinc-300',
  }

  return (
    <button
      type='button'
      onClick={isMulti ? onPick : undefined}
      className={cn(
        'group relative flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 transition-all duration-300',
        isMulti
          ? 'cursor-pointer border-white/10 hover:border-cyan-400/40 hover:bg-white/4 hover:shadow-lg hover:shadow-cyan-500/10'
          : 'cursor-default border-white/5 opacity-60',
      )}
    >
      <span
        className='w-6 shrink-0 text-xs tabular-nums text-white/25'
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {String(slot.trackNumber).padStart(2, '0')}
      </span>

      {selected.releaseCover ? (
        <div className='relative h-7 w-7 shrink-0 overflow-hidden rounded'>
          <Image
            src={selected.releaseCover}
            alt={selected.releaseTitle}
            fill
            className='object-cover opacity-80'
            sizes='28px'
          />
        </div>
      ) : (
        <div className='h-7 w-7 shrink-0 rounded bg-white/5' />
      )}

      <span className='min-w-0 flex-1 truncate text-left text-sm font-medium text-white/90'>
        {selected.title}
      </span>

      <span
        className={cn(
          'shrink-0 rounded-full border border-white/10 px-2 py-px text-[10px] font-semibold tracking-wide',
          colors.bg,
          colors.text,
        )}
      >
        {selected.releaseTitle}
      </span>

      {isMulti && (
        <span className='ml-0.5 shrink-0 text-[11px] text-cyan-400/50 transition-colors group-hover:text-cyan-400'>
          ⇄
        </span>
      )}
    </button>
  )
}
