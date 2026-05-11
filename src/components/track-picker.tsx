'use client'

import Image from 'next/image'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { PICKER_COLORS } from '@/lib/colors'
import type { SlotOption } from '@/lib/data'

interface TrackPickerProps {
  open: boolean
  onClose: () => void
  trackNumber: number
  options: SlotOption[]
  selected: SlotOption
  onSelect: (option: SlotOption) => void
}

export const TrackPicker = ({
  open,
  onClose,
  trackNumber,
  options,
  selected,
  onSelect,
}: TrackPickerProps) => {
  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side='bottom'
        className='rounded-t-3xl border-t border-white/10 bg-[#07080f] px-0 pb-10 pt-0'
      >
        <SheetHeader className='border-b border-white/8 px-5 py-4'>
          <div className='mb-0.5 font-mono text-[10px] tracking-widest text-cyan-400/60 uppercase'>
            Track {String(trackNumber).padStart(2, '0')}
          </div>
          <SheetTitle
            className='text-left text-base font-bold text-white'
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            Choose your version
          </SheetTitle>
          <SheetDescription className='sr-only'>
            Select which version of track {trackNumber} to include in your album
          </SheetDescription>
        </SheetHeader>

        <div className='flex flex-col gap-2 overflow-y-auto px-4 pt-3' style={{ maxHeight: '55vh' }}>
          {options.map((option) => {
            const isActive = option.releaseId === selected.releaseId
            const colors = PICKER_COLORS[option.releaseTitle] ?? {
              border: 'border-white/10',
              text: 'text-white/60',
              activeBg: 'bg-white/5',
            }

            return (
              <button
                key={option.releaseId}
                type='button'
                onClick={() => {
                  onSelect(option)
                  onClose()
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200',
                  isActive
                    ? cn(colors.activeBg, colors.border)
                    : 'border-white/8 bg-white/2 hover:bg-white/5 hover:border-white/15',
                )}
              >
                {option.releaseCover ? (
                  <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-md'>
                    <Image
                      src={option.releaseCover}
                      alt={option.releaseTitle}
                      fill
                      className='object-cover'
                      sizes='40px'
                    />
                  </div>
                ) : (
                  <div className='h-10 w-10 shrink-0 rounded-md bg-white/5' />
                )}

                <div className='min-w-0 flex-1'>
                  <div className='truncate text-sm font-semibold text-white'>
                    {option.title}
                  </div>
                  <div className='mt-0.5 flex items-center gap-1.5'>
                    <span className={cn('text-[11px] font-medium', isActive ? colors.text : 'text-white/40')}>
                      {option.releaseTitle}
                    </span>
                    <span className='text-[10px] text-white/20'>·</span>
                    <span className='font-mono text-[10px] text-white/25'>
                      {option.releaseYear}
                    </span>
                    {option.collaborators && option.collaborators.length > 0 && (
                      <>
                        <span className='text-[10px] text-white/20'>·</span>
                        <span className='text-[10px] text-white/25'>
                          w/ {option.collaborators.join(', ')}
                        </span>
                      </>
                    )}
                    {option.releaseType === 'ep' && (
                      <span className='rounded-full border border-white/10 bg-white/5 px-1.5 py-px font-mono text-[9px] text-white/30'>
                        EP
                      </span>
                    )}
                  </div>
                </div>

                {isActive && (
                  <span className='shrink-0 text-[10px] text-cyan-400'>✦</span>
                )}
              </button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
