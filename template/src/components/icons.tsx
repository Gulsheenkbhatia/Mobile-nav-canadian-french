import type { ReactNode, SVGProps } from 'react'

/** Shared stroke icons: 24×24 grid, 1.5px stroke — matches prototype tokens */
const strokeAttrs = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export type CoachIconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'children'> & {
  size?: 'sm' | 'md' | 'lg'
}

const px = { sm: 20, md: 22, lg: 24 }

function IconFrame({
  size = 'lg',
  className,
  children,
  viewBox,
  ...rest
}: CoachIconProps & { viewBox: string; children: ReactNode }) {
  const s = px[size]
  return (
    <svg
      width={s}
      height={s}
      viewBox={viewBox}
      className={['coach-icon', className].filter(Boolean).join(' ')}
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  )
}

/** Flyout search field */
export function IconSearch(props: CoachIconProps) {
  return (
    <IconFrame viewBox="0 0 24 24" {...props}>
      <circle cx="11" cy="11" r="6" {...strokeAttrs} />
      <path d="M15.5 15.5 20 20" {...strokeAttrs} />
    </IconFrame>
  )
}

/** Close / dismiss */
export function IconClose(props: CoachIconProps) {
  return (
    <IconFrame viewBox="0 0 24 24" {...props}>
      <path d="M6 6l12 12M18 6 6 18" {...strokeAttrs} />
    </IconFrame>
  )
}

/** Header: hamburger + search lens (single composite mark) */
export function IconMenuSearchCombo(props: CoachIconProps) {
  return (
    <IconFrame viewBox="0 0 24 24" {...props}>
      <path d="M4.5 7.5h9M4.5 12h9M4.5 16.5h6" {...strokeAttrs} />
      <circle cx="17.5" cy="16" r="4.25" {...strokeAttrs} />
      <path d="M20.5 19 22 20.5" {...strokeAttrs} />
    </IconFrame>
  )
}

/** Shopping bag with count */
export function IconBag({ count, className, ...rest }: CoachIconProps & { count: number }) {
  const display = count > 99 ? '99+' : String(count)
  return (
    <svg
      width={px.md}
      height={24}
      viewBox="0 0 22 24"
      className={['coach-icon', 'coach-icon--bag', className].filter(Boolean).join(' ')}
      aria-hidden
      {...rest}
    >
      <path
        d="M4 9.5V20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 9.5V7a3 3 0 0 1 6 0v2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="11"
        y="17.25"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="currentColor"
        className="coach-icon__bagCount"
        fontSize="8.5"
        fontWeight="600"
        fontFamily="var(--coach-font-sans)"
      >
        {display}
      </text>
    </svg>
  )
}

/** Accordion; rotates 45° when open */
export function IconPlus({ open, className, ...rest }: CoachIconProps & { open?: boolean }) {
  return (
    <IconFrame
      viewBox="0 0 24 24"
      size="sm"
      className={[open ? 'coach-icon--plus-open' : '', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <path d="M12 6v12M6 12h12" {...strokeAttrs} />
    </IconFrame>
  )
}

/** Footer: account */
export function IconUser(props: CoachIconProps) {
  return (
    <IconFrame viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="9" r="3.25" {...strokeAttrs} />
      <path d="M6.5 20.5c0-3 2.75-5 5.5-5s5.5 2 5.5 5" {...strokeAttrs} />
    </IconFrame>
  )
}

/** Footer: track / package */
export function IconPackage(props: CoachIconProps) {
  return (
    <IconFrame viewBox="0 0 24 24" {...props}>
      <path d="M5.5 9 12 6l6.5 3v9L12 21l-6.5-3V9Z" {...strokeAttrs} />
      <path d="M5.5 9 12 12l6.5-3" {...strokeAttrs} />
      <path d="M12 12v9" {...strokeAttrs} />
    </IconFrame>
  )
}

/** Footer: help */
export function IconChat(props: CoachIconProps) {
  return (
    <IconFrame viewBox="0 0 24 24" {...props}>
      <path
        d="M6.5 6.5h11A2.5 2.5 0 0 1 20 9v5.5A2.5 2.5 0 0 1 17.5 17H13l-4.5 3v-3h-2A2.5 2.5 0 0 1 4 14.5V9a2.5 2.5 0 0 1 2.5-2.5Z"
        {...strokeAttrs}
      />
    </IconFrame>
  )
}

/** US flag */
export function IconFlagUs(props: Omit<CoachIconProps, 'size'>) {
  const { className, ...rest } = props
  return (
    <svg
      width={22}
      height={16}
      viewBox="0 0 22 16"
      className={['coach-icon', 'coach-icon--flag', className].filter(Boolean).join(' ')}
      aria-hidden
      {...rest}
    >
      <rect x="0.5" y="0.5" width="21" height="15" rx="1" fill="var(--coach-color-neutral-light)" stroke="var(--coach-color-flag-border)" strokeWidth="1" />
      <rect x="0.5" y="0.5" width="8.8" height="7.5" fill="var(--coach-color-flag-blue)" />
      <path
        fill="var(--coach-color-flag-red)"
        d="M0.5 1.5h21v1.1H0.5Zm0 2.2h21v1.1H0.5Zm0 2.2h21v1.1H0.5Zm0 2.2h21v1.1H0.5Zm0 2.2h21v1.1H0.5Zm0 2.2h21v1.1H0.5Zm0 2.2h21v1.1H0.5Z"
      />
      <g fill="var(--coach-color-neutral-light)">
        <rect x="1.5" y="2" width="1" height="1" />
        <rect x="3.5" y="2" width="1" height="1" />
        <rect x="5.5" y="2" width="1" height="1" />
        <rect x="2.5" y="3.5" width="1" height="1" />
        <rect x="4.5" y="3.5" width="1" height="1" />
        <rect x="6.5" y="3.5" width="1" height="1" />
        <rect x="1.5" y="5" width="1" height="1" />
        <rect x="3.5" y="5" width="1" height="1" />
        <rect x="5.5" y="5" width="1" height="1" />
      </g>
    </svg>
  )
}
