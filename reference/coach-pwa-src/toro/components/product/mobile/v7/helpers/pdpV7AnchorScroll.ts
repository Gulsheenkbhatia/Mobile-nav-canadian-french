/** Matches `data-pdp-v7-anchor-nav` on `PDPAnchorNavV7` root. */
export const PDP_V7_ANCHOR_NAV_SELECTOR = '[data-pdp-v7-anchor-nav]'

export const PDP_V7_ANCHOR_SCROLL_EXTRA_PX = 120

export function getPdpV7AnchorScrollOffsetPx(
  nav: HTMLElement | null,
  stickyHeaderHeight: number,
  extraPx = 0
): number {
  const navHeight = nav?.getBoundingClientRect().height ?? 0
  return stickyHeaderHeight + navHeight + extraPx
}
export function scrollPdpV7AnchorElementIntoView(el: HTMLElement | null): void {
  if (!el) return
  el.scrollIntoView({
    behavior: 'auto',
    block: 'start',
    inline: 'nearest',
  })
}
