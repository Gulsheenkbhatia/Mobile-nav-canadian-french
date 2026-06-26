import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from 'react'

export type NavAnimDirection = 'enter' | 'exit' | 'idle'

/** V3 text link load-in — coach-nav.vercel.app Id variant. */
export const NAV_LINK_ENTER = {
  variant: 'slide-in' as const,
  stagger: 0.05,
} as const

/** L1 link list — after drawer lands. */
export const NAV_LINK_ENTER_L1_DELAY = 0.15

/** L2/L3 link lists — first link after drill panel lands. */
export const NAV_LINK_ENTER_DRILL_DELAY = 0.15

/** V3 image collage load-in — coach-nav.vercel.app Fd variant. */
export const NAV_IMAGE_ENTER = {
  variant: 'fade-down' as const,
  stagger: 0.1,
  delay: 0.2,
} as const

type NavEnterGroupProps = {
  /** Seconds before first child animates (vercel delayChildren). */
  delay?: number
  /** Seconds between each child (vercel staggerChildren). */
  stagger?: number
  variant?: 'fade-down' | 'slide-in'
  direction?: NavAnimDirection
  className?: string
  /** Render as ul/ol without extra wrapper divs around list items. */
  list?: boolean
  as?: ElementType
  children: ReactNode
}

function itemStyle(
  index: number,
  delay: number,
  stagger: number,
  count: number,
  direction: NavAnimDirection,
): CSSProperties {
  const staggerIndex =
    direction === 'exit' ? Math.max(0, count - 1 - index) : index

  return {
    '--nav-enter-i': String(staggerIndex),
    '--nav-enter-delay': String(delay),
    '--nav-enter-stagger': String(stagger),
    '--nav-enter-count': String(count),
  } as CSSProperties
}

/** Staggered content entrance — mirrors vercel V3 Framer Motion Fd / Id variants. */
export function NavEnterGroup({
  delay = 0,
  stagger = 0.05,
  variant = 'slide-in',
  direction = 'enter',
  className = '',
  list = false,
  as: Tag = 'div',
  children,
}: NavEnterGroupProps) {
  const items = Children.toArray(children)
  const count = items.length

  const groupStyle = {
    '--nav-enter-delay': String(delay),
    '--nav-enter-stagger': String(stagger),
    '--nav-enter-count': String(count),
  } as CSSProperties

  const groupClass = [
    'nav-enter-group',
    `nav-enter-group--${variant}`,
    variant === 'slide-in' ? 'nav-link-enter-group' : '',
    direction === 'exit' ? 'nav-enter-group--exit' : '',
    direction === 'idle' ? 'nav-enter-group--idle' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (list) {
    return (
      <Tag className={groupClass} style={groupStyle}>
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) return child
          const element = child as ReactElement<{ className?: string; style?: CSSProperties }>
          return cloneElement(element, {
            className: `nav-enter-group__item ${element.props.className ?? ''}`.trim(),
            style: {
              ...element.props.style,
              ...itemStyle(index, delay, stagger, count, direction),
            },
          })
        })}
      </Tag>
    )
  }

  return (
    <Tag className={groupClass} style={groupStyle}>
      {items.map((child, index) => (
        <div
          key={index}
          className="nav-enter-group__item"
          style={itemStyle(index, delay, stagger, count, direction)}
        >
          {child}
        </div>
      ))}
    </Tag>
  )
}

type NavEnterItemProps = {
  variant?: 'fade-down' | 'slide-in'
  direction?: NavAnimDirection
  delay?: number
  className?: string
  children: ReactNode
}

/** Single delayed entrance (vercel Ld helper). */
export function NavEnterItem({
  variant = 'slide-in',
  direction = 'enter',
  delay = 0,
  className = '',
  children,
}: NavEnterItemProps) {
  return (
    <div
      className={[
        'nav-enter-group__item',
        'nav-enter-group__item--solo',
        `nav-enter-group__item--${variant}`,
        direction === 'exit' ? 'nav-enter-group__item--exit' : '',
        direction === 'idle' ? 'nav-enter-group__item--idle' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={itemStyle(0, delay, 0, 1, direction)}
    >
      {children}
    </div>
  )
}
