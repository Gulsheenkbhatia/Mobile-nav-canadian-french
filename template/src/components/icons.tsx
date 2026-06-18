import type { ReactNode, SVGProps } from 'react'

/** Shared stroke icons — stroke width matches `design-tokens.css` `--coach-icon-stroke` */
const SW = 1.25

const strokeAttrs = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: SW,
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
      <circle cx="10.5" cy="10.5" r="5.75" {...strokeAttrs} />
      <path d="M15 15.5 20 20.5" {...strokeAttrs} />
    </IconFrame>
  )
}

/** Close / dismiss */
export function IconClose(props: CoachIconProps) {
  return (
    <IconFrame viewBox="0 0 24 24" {...props}>
      <path d="M7 7l10 10M17 7 7 17" {...strokeAttrs} />
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
        strokeWidth={SW}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 9.5V7a3 3 0 0 1 6 0v2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={SW}
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

/** Footer: account */
export function IconUser(props: CoachIconProps) {
  return (
    <IconFrame viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="8.5" r="3" {...strokeAttrs} />
      <path d="M6.5 20.5c.25-2.75 2.75-4.75 5.5-4.75s5.25 2 5.5 4.75" {...strokeAttrs} />
    </IconFrame>
  )
}

/** Footer: track / package */
export function IconPackage(props: CoachIconProps) {
  return (
    <IconFrame viewBox="0 0 24 24" {...props}>
      <path d="M5.5 9 12 6l6.5 3v8.5L12 21l-6.5-3.5V9Z" {...strokeAttrs} />
      <path d="M5.5 9 12 12l6.5-3" {...strokeAttrs} />
      <path d="M12 12v8.75" {...strokeAttrs} />
    </IconFrame>
  )
}

/** Footer: help */
export function IconChat(props: CoachIconProps) {
  return (
    <IconFrame viewBox="0 0 24 24" {...props}>
      <path
        d="M7 7.5h10a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-4.2L8.5 19v-2.5H7a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2Z"
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
