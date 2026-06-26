import { CoachButton } from './CoachButton'
import type { HomepageHero } from '../../data/homepageData'

type MobileHeroProps = {
  hero: HomepageHero
}

export function MobileHero({ hero }: MobileHeroProps) {
  const backgroundStyle = hero.imageUrl
    ? {
        backgroundImage: `url(${hero.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: hero.imageBg }

  const sectionClass = hero.compact ? 'home-hero home-hero--compact' : 'home-hero'

  return (
    <section
      className={sectionClass}
      style={backgroundStyle}
      aria-label={hero.title}
    >
      <div className="home-hero__scrim" aria-hidden />
      <div className="home-hero__content">
        {hero.eyebrow && (
          <p className="type-eyebrow mb-coach-s text-coach-white/90">{hero.eyebrow}</p>
        )}
        <h1 className="type-title-1 text-balance text-coach-white">{hero.title}</h1>
        {hero.body && (
          <p className="type-body-2 mt-coach-s max-w-[18rem] text-coach-white/90">{hero.body}</p>
        )}
        <div className="mt-coach-lg flex flex-col items-start gap-coach-s">
          <CoachButton variant="secondary" className="border-0 bg-coach-white text-coach-black hover:bg-coach-page">
            {hero.primaryCta}
          </CoachButton>
          {hero.secondaryCta && (
            <button
              type="button"
              className="min-h-11 px-1 py-2 text-sm tracking-[0.3px] text-coach-white underline underline-offset-2"
            >
              {hero.secondaryCta}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
