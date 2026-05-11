import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ALL_ARTISTS } from '@/lib/artists'

export default function Home() {
  return (
    <main
      className='min-h-screen'
      style={{ background: '#080810', fontFamily: 'var(--font-syne)' }}
    >
      <div className='mx-auto max-w-lg px-4 pb-16 pt-12 sm:px-6'>
        <header className='mb-8'>
          <p className='mb-1 font-mono text-[10px] tracking-widest text-cyan-400/50 uppercase'>
            Album Builder
          </p>
          <h1 className='text-2xl font-bold tracking-tight text-white'>
            Choose an Artist
          </h1>
          <p className='mt-1.5 text-sm text-white/30'>
            Build your ultimate custom album from their full discography.
          </p>
        </header>

        <div className='flex flex-col gap-3'>
          {ALL_ARTISTS.map((artist) => (
            <Link
              key={artist.id}
              href={`/artist/${artist.slug}`}
              className='group flex items-center gap-4 rounded-xl border border-white/8 bg-white/2 px-4 py-4 transition-all duration-200 hover:border-cyan-400/30 hover:bg-white/4 hover:shadow-lg hover:shadow-cyan-500/8'
            >
              <div className='min-w-0 flex-1'>
                <div className='text-base font-bold text-white group-hover:text-cyan-50 transition-colors'>
                  {artist.name}
                </div>
                <div className='mt-0.5 flex items-center gap-2'>
                  <span className='text-xs text-white/35'>{artist.genre}</span>
                  <span className='text-[10px] text-white/20'>·</span>
                  <span className='text-xs text-white/25'>{artist.origin}</span>
                </div>
              </div>
              <ChevronRight className='h-4 w-4 shrink-0 text-white/20 transition-colors group-hover:text-cyan-400' />
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
