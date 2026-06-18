import { LOW_POWER_ANCHOR_CLASS } from 'toro/cms/constants'

type InitializeSlotLinksOptions = {
  isSubBrandActive: boolean
  onNavigation?: (href: string) => void | Promise<void>
  onClick?: (event: MouseEvent) => void
  subBrand?: string
}

type InitializeSlotLinks = (
  node: HTMLElement,
  options: InitializeSlotLinksOptions
) => HTMLAnchorElement['removeEventListener'][]

const testSubBrandUrl = (href: string, subBrand: string, isSubBrandActive: boolean) => {
  if (!subBrand || /^(?!.*(?:\/(shop|product)\/))/.test(href)) {
    return false
  }
  const isSubBrandUrl = new RegExp(`^.*(?:(/${subBrand}|is${subBrand}=true))`, 'i').test(href)
  return isSubBrandActive ? !isSubBrandUrl : isSubBrandUrl
}

const transformLink =
  ({ onNavigation, onClick, subBrand, isSubBrandActive = false }: InitializeSlotLinksOptions) =>
  (link: HTMLAnchorElement) => {
    const { href, target, dataset, classList } = link
    link.dataset.customLink = 'true'
    const isNewWindowTab = target === '_blank'
    const isCMSTileSwatch = link.closest('.product-tile__swatch')

    const onLinkClick = (event: MouseEvent) => {
      event.preventDefault()
      onClick?.(event)

      if (isCMSTileSwatch) {
        return
      }

      const isBrandSwitch = testSubBrandUrl(href, subBrand, isSubBrandActive)

      if (isBrandSwitch || isNewWindowTab) {
        if (!dataset.promotionId) {
          event.stopPropagation()
        }
        window.open(href, isNewWindowTab ? '_blank' : '_self')
        return false
      } else {
        if (classList.contains(LOW_POWER_ANCHOR_CLASS)) {
          classList.remove(LOW_POWER_ANCHOR_CLASS)
          return
        } else {
          const updatedHref = event.target instanceof HTMLAnchorElement ? event.target.href : href
          onNavigation?.(updatedHref || href)
        }
      }
    }
    link.addEventListener('click', onLinkClick)
    return () => link.removeEventListener('click', onLinkClick)
  }

const initializeSlotLinks: InitializeSlotLinks = (node, options) => {
  if (!node) {
    return []
  }
  const internalLinks = node.querySelectorAll(`a[href^='/']`) as NodeListOf<HTMLAnchorElement>
  return Array.from(internalLinks).map(transformLink(options))
}

export default initializeSlotLinks
