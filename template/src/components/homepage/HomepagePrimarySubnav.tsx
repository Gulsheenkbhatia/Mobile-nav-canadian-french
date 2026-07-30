import { CoachtopiaLogo } from '../nav/CoachLogos'
import type { HomepageLink } from '../../data/homepageContent'
import { navMessages } from '../../locales'

type HomepagePrimarySubnavProps = {
  links: HomepageLink[]
}

/** Scrollable L1 category strip — coach-nav.vercel.app primary subnav. */
export function HomepagePrimarySubnav({ links }: HomepagePrimarySubnavProps) {
  return (
    <nav
      aria-label={navMessages.homepagePrimaryNav}
      className="flex items-baseline gap-6 overflow-x-auto border-b border-coach-grey-20 bg-coach-white px-coach-m py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {links.map((link) => {
        const isCoachtopia = link.label === 'Coachtopia'
        return (
          <a
            key={link.label}
            href={link.href}
            aria-label={link.label}
            className={`flex shrink-0 items-center whitespace-nowrap text-coach-black no-underline ${
              isCoachtopia ? '' : 'text-[15px] font-bold tracking-[0.3px]'
            }`}
            onClick={(e) => e.preventDefault()}
          >
            {isCoachtopia ? <CoachtopiaLogo height={16} className="relative top-[3px]" /> : link.label}
          </a>
        )
      })}
    </nav>
  )
}
