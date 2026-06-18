import { useEffect, useMemo, useState } from 'react'
import { coachNavMock, footerUtilityMock, type NavLinkItem } from '../data/coachNavMock'
import { IconChat, IconClose, IconFlagUs, IconPackage, IconSearch, IconUser } from './icons'
import './MobileNavFlyout.css'

type Props = {
  isOpen: boolean
  onClose: () => void
}

function FooterGlyph({ type }: { type: (typeof footerUtilityMock)[number]['icon'] }) {
  const md = { size: 'md' as const }
  switch (type) {
    case 'user':
      return <IconUser {...md} />
    case 'flag':
      return <IconFlagUs />
    case 'box':
      return <IconPackage {...md} />
    case 'chat':
      return <IconChat {...md} />
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
            <div className="mnf-brandTabs__tab mnf-brandTabs__tab--active">
              <span className="mnf-wordmark">COACH</span>
            </div>
            <div className="mnf-brandTabs__tab mnf-brandTabs__tab--outlet">
              <span className="mnf-wordmark mnf-wordmark--inverse">COACH OUTLET</span>
            </div>
          </div>
          <button type="button" className="mnf-close" onClick={onClose} aria-label="Close menu">
            <IconClose size="lg" />
          </button>
        </div>

        <div className="mnf-searchWrap">
          <label className="mnf-search">
            <IconSearch size="md" />
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
              <FooterGlyph type={u.icon} />
              <span className="mnf-footer__label">{u.label}</span>
            </button>
          ))}
        </footer>
      </div>
    </div>
  )
}
