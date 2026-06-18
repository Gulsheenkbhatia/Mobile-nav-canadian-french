import { useEffect, useMemo, useState } from 'react'
import { coachNavMock, footerUtilityMock, type NavLinkItem } from '../data/coachNavMock'
import './MobileNavFlyout.css'

type Props = {
  isOpen: boolean
  onClose: () => void
}

function IconSearch() {
  return (
    <svg className="mnf-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path d="M14.5 14.5L21 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg className="mnf-icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

function FooterIcon({ type }: { type: 'user' | 'flag' | 'box' | 'chat' }) {
  switch (type) {
    case 'user':
      return (
        <svg className="mnf-footerIcon" width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="9" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M6 20c0-3.5 2.5-5.5 6-5.5s6 2 6 5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'flag':
      return (
        <svg className="mnf-footerIcon" width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <rect x="5" y="5" width="10" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 12h14v7H5z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'box':
      return (
        <svg className="mnf-footerIcon" width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M5 8l7-3 7 3v9l-7 3-7-3V8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M5 8l7 3 7-3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'chat':
      return (
        <svg className="mnf-footerIcon" width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M6 6h12a2 2 0 012 2v6a2 2 0 01-2 2h-6l-4 3v-3H6a2 2 0 01-2-2V8a2 2 0 012-2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}

function tier1FromId(id: string | null): (typeof coachNavMock)[number] | undefined {
  if (!id) return undefined
  return coachNavMock.find((c) => c.id === id)
}

function NavRow({
  item,
  expanded,
  onToggle,
}: {
  item: NavLinkItem
  expanded: boolean
  onToggle: () => void
}) {
  const hasChildren = Boolean(item.children?.length)

  if (!hasChildren) {
    return (
      <a className="mnf-row mnf-row--link" href={item.href ?? '#'}>
        <span className="mnf-row__label">{item.label}</span>
      </a>
    )
  }

  return (
    <div className="mnf-row mnf-row--accordion">
      <button type="button" className="mnf-row__trigger" aria-expanded={expanded} onClick={onToggle}>
        <span className="mnf-row__label">{item.label}</span>
        <span className={`mnf-row__plus ${expanded ? 'mnf-row__plus--open' : ''}`} aria-hidden>
          +
        </span>
      </button>
      {expanded && item.children && (
        <ul className="mnf-subList">
          {item.children.map((c) => (
            <li key={c.id}>
              <a className="mnf-subLink" href={c.href}>
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function MobileNavFlyout({ isOpen, onClose }: Props) {
  const [activeTier1Id, setActiveTier1Id] = useState(coachNavMock[0]?.id ?? 'women')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set())

  const activeTier1 = useMemo(() => tier1FromId(activeTier1Id), [activeTier1Id])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) setExpandedIds(new Set())
  }, [isOpen, activeTier1Id])

  if (!isOpen) return null

  const toggle = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mnf-root" role="dialog" aria-modal="true" aria-label="Shop navigation">
      <div className="mnf-panel" onClick={(e) => e.stopPropagation()}>
        <div className="mnf-topBar">
          <div className="mnf-brandTabs" role="tablist" aria-label="Brand">
            <div className="mnf-brandTabs__tab mnf-brandTabs__tab--active">COACH</div>
            <div className="mnf-brandTabs__tab">COACH OUTLET</div>
          </div>
          <button type="button" className="mnf-close" onClick={onClose} aria-label="Close menu">
            <IconClose />
          </button>
        </div>

        <div className="mnf-searchWrap">
          <label className="mnf-search">
            <IconSearch />
            <input type="search" placeholder="Search" autoComplete="off" className="mnf-search__input" />
          </label>
        </div>

        <div className="mnf-tier1Wrap">
          <div className="mnf-tier1" role="tablist" aria-label="Categories">
            {coachNavMock.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={cat.id === activeTier1Id}
                className={`mnf-tier1__chip ${cat.id === activeTier1Id ? 'mnf-tier1__chip--active' : ''}`}
                onClick={() => setActiveTier1Id(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mnf-scroll">
          <nav className="mnf-tier2" aria-label={activeTier1?.label ?? 'Subcategories'}>
            {activeTier1?.items.map((item) => (
              <NavRow
                key={item.id}
                item={item}
                expanded={expandedIds.has(item.id)}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </nav>
        </div>

        <footer className="mnf-footer">
          {footerUtilityMock.map((u) => (
            <button key={u.id} type="button" className="mnf-footer__item">
              <FooterIcon type={u.icon} />
              <span className="mnf-footer__label">{u.label}</span>
            </button>
          ))}
        </footer>
      </div>
    </div>
  )
}
