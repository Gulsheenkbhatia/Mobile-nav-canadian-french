/** Bag + menu/search icons — coach header mobile V2 (coach-srp-filter-prototype) */

export function BagIconV2() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 9V7.5C8 5.843 9.343 4.5 11 4.5H13C14.657 4.5 16 5.843 16 7.5V9M6 9H18L17 19H7L6 9Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </svg>
  )
}

export function SearchIcon16() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1" />
      <line x1="13.5" y1="13.5" x2="18" y2="18" stroke="currentColor" strokeWidth="1" />
    </svg>
  )
}

export function MenuSearchIconV2() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 6H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M3 12H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M3 18H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="17" cy="14" r="4.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <path d="M20.5 17.5L23 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

/** White menu close X — coach design token m-close-white (24×24). */
export function CloseMenuIconWhite() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
