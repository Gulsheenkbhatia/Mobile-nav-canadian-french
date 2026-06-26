import type { HomepageSubnavLink } from '../../data/homepageData'

export type HomepageVideoHeroProps = {
  title: string
  primaryCta: string
  videoSrc: string
  posterSrc?: string
  subnavLinks: HomepageSubnavLink[]
}

/** Full-bleed mobile homepage video hero with subnav strip. */
export function HomepageVideoHero({
  title,
  primaryCta,
  videoSrc,
  posterSrc,
  subnavLinks,
}: HomepageVideoHeroProps) {
  return (
    <section className="home-video-hero" aria-label="Featured">
      <video
        className="home-video-hero__video"
        src={videoSrc}
        poster={posterSrc}
        muted
        playsInline
        autoPlay
        loop
        preload="metadata"
      />
      <div className="home-video-hero__scrim" aria-hidden />
      <div className="home-video-hero__content">
        <h2 className="home-video-hero__title">{title}</h2>
        <button type="button" className="home-video-hero__cta">
          {primaryCta}
        </button>
      </div>
      <nav className="home-video-hero__subnav" aria-label="Shop shortcuts">
        <div className="home-video-hero__subnav-scroll">
          {subnavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="home-video-hero__subnav-link"
              onClick={(e) => e.preventDefault()}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </section>
  )
}
