import { useRef, useState, type MouseEvent } from 'react'
import type { HomepageShowcaseCard } from '../../data/homepageContent'
import { getShowcaseColumns } from '../../data/homepageContent'

import { navMessages } from '../../locales'

function QuickAddButton() {
  return (
    <button
      type="button"
      aria-label={navMessages.homepageQuickAdd}
      onClick={(e) => e.preventDefault()}
      className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-coach-white/95 text-coach-black shadow-[0_1px_4px_rgba(0,0,0,0.18)] transition-transform active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  )
}

function VideoPlayPause({
  playing,
  onToggle,
}: {
  playing: boolean
  onToggle: (e: MouseEvent) => void
}) {
  return (
    <button
      type="button"
      aria-label={playing ? navMessages.homepagePauseVideo : navMessages.homepagePlayVideo}
      aria-pressed={playing}
      onClick={onToggle}
      className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition-colors hover:bg-black/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-coach-white"
    >
      {playing ? (
        <svg viewBox="0 0 24 24" className="h-3 w-3 text-coach-white" fill="currentColor" aria-hidden>
          <rect x="7" y="6" width="3.2" height="12" rx="1" />
          <rect x="13.8" y="6" width="3.2" height="12" rx="1" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3 w-3 text-coach-white" fill="currentColor" aria-hidden>
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      )}
    </button>
  )
}

function ShowcaseVideoCard({ card }: { card: HomepageShowcaseCard }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  return (
    <a
      href={card.ctaHref ?? '#'}
      onClick={(e) => e.preventDefault()}
      className="relative block overflow-hidden rounded-coach-m bg-coach-grey-20"
    >
      <video
        ref={videoRef}
        className="block w-full"
        src={card.videoUrl}
        poster={card.posterUrl ?? card.imageUrl}
        muted
        playsInline
        autoPlay
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <VideoPlayPause
        playing={playing}
        onToggle={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const video = videoRef.current
          if (!video) return
          if (video.paused) video.play()
          else video.pause()
        }}
      />
      <QuickAddButton />
    </a>
  )
}

function ShowcaseCard({ card }: { card: HomepageShowcaseCard }) {
  if (card.kind === 'product') {
    return (
      <a
        href={card.ctaHref ?? '#'}
        onClick={(e) => e.preventDefault()}
        className="home-showcase-card group block"
      >
        <div className="overflow-hidden rounded-coach-m bg-[#f3eee7]">
          <img src={card.imageUrl} alt={card.ctaLabel ?? ''} loading="lazy" className="block w-full" />
        </div>
        {card.ctaLabel && (
          <p className="mt-coach-s text-center text-[13px] font-bold tracking-[0.2px] text-coach-black">
            <span className="home-showcase-card__cta">{card.ctaLabel}</span>
          </p>
        )}
      </a>
    )
  }

  if (card.isVideo && card.videoUrl) {
    return <ShowcaseVideoCard card={card} />
  }

  return (
    <a
      href={card.ctaHref ?? '#'}
      onClick={(e) => e.preventDefault()}
      className="relative block overflow-hidden rounded-coach-m bg-coach-grey-20"
    >
      <img src={card.imageUrl} alt="" loading="lazy" className="block w-full" />
      <QuickAddButton />
    </a>
  )
}

type HomepageShowcaseProps = {
  cards: HomepageShowcaseCard[]
}

/** Two-column campaign card grid — coach-nav.vercel.app showcase. */
export function HomepageShowcase({ cards }: HomepageShowcaseProps) {
  const { left, right } = getShowcaseColumns(cards)
  if (left.length === 0 && right.length === 0) return null

  return (
    <section className="mt-coach-m px-coach-xs" aria-label={navMessages.homepageShopCampaign}>
      <div className="flex items-start gap-1.5">
        <div className="flex w-1/2 flex-col gap-1.5">
          {left.map((card) => (
            <ShowcaseCard key={card.id} card={card} />
          ))}
        </div>
        <div className="mt-coach-lg flex w-1/2 flex-col gap-1.5">
          {right.map((card) => (
            <ShowcaseCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}
