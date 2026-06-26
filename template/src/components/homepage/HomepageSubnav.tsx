import type { HomepageSubnavLink } from '../../data/homepageData'
import { CoachtopiaLogo, isCoachtopiaCategory } from '../nav/CoachLogos'

type HomepageSubnavProps = {
  links: HomepageSubnavLink[]
}

/** Quick shop links below the homepage hero — matches coach.com mobile subnav strip. */
export function HomepageSubnav({ links }: HomepageSubnavProps) {
  return (
    <nav className="home-video-hero__subnav home-subnav--below-hero" aria-label="Shop shortcuts">
      <div className="home-video-hero__subnav-scroll">
        {links.map((link) => (
          <a
            key={link.id ?? link.label}
            href={link.href}
            className="home-video-hero__subnav-link"
            onClick={(e) => e.preventDefault()}
          >
            {link.id && isCoachtopiaCategory(link.id) ? (
              <CoachtopiaLogo height={12} />
            ) : (
              link.label
            )}
          </a>
        ))}
      </div>
    </nav>
  )
}
