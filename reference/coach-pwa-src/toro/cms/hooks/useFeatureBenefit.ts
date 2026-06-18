import { useState, useEffect } from 'react'

const WITH_COLLAPSIBLE_CONTENT_SELECTOR = '.with-content'
const FEATURE_BENEFIT_CARD_SELECTOR = '.feature-benefit-card'
const FEATURE_BENEFIT_CARD_TOP_BLOCK_SELECTOR = '.feature-benefit-card_top-block'
const DRAWER_ICONS_SELECTOR = '.drawer-icon .close-icon, .drawer-icon .open-icon'
const FEATURE_BENEFIT_CARD_TILE_CLASS = 'feature-benefit-card-tile'
const FEATURE_BENEFIT_WRAPPER_SELECTOR = '.feature-benefit-cards'

const isWithCollapsibleContent = (element: ParentNode): boolean => {
  return !!element.querySelector(WITH_COLLAPSIBLE_CONTENT_SELECTOR)
}

function toggleIconsVisibility(currentElement: HTMLElement) {
  currentElement
    .querySelectorAll(DRAWER_ICONS_SELECTOR)
    .forEach((icon) => icon.classList.toggle('d-none'))
}

function resetOtherCards(currentElement: HTMLElement) {
  const featureBenefitWrapper = currentElement.closest(FEATURE_BENEFIT_WRAPPER_SELECTOR)
  if (!featureBenefitWrapper) {
    return
  }
  featureBenefitWrapper.querySelectorAll(FEATURE_BENEFIT_CARD_SELECTOR).forEach((card: Element) => {
    if (card !== currentElement && card.classList.contains('expanded')) {
      card.classList.remove('expanded')

      const closeIcon = card.querySelector('.drawer-icon .close-icon')
      const openIcon = card.querySelector('.drawer-icon .open-icon')

      if (!closeIcon?.classList.contains('d-none')) {
        closeIcon.classList.add('d-none')
      }
      if (openIcon?.classList.contains('d-none')) {
        openIcon.classList.remove('d-none')
      }
    }
  })
}

function scrollCardIntoView(currentElement: HTMLElement) {
  const parentElement = currentElement.closest(
    `.${FEATURE_BENEFIT_CARD_TILE_CLASS}`
  ) as HTMLElement | null

  const prevSibling = parentElement?.previousElementSibling as HTMLElement | null
  const scrollTarget = prevSibling?.classList.contains(FEATURE_BENEFIT_CARD_TILE_CLASS)
    ? prevSibling
    : currentElement

  scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
}

function getClickSelector(hasCollapsibleContent: boolean): string {
  return hasCollapsibleContent
    ? FEATURE_BENEFIT_CARD_TOP_BLOCK_SELECTOR
    : FEATURE_BENEFIT_CARD_SELECTOR
}

function featureBenefit(element: ParentNode | null): (() => void) | void {
  if (!element) {
    return
  }
  const hasCollapsibleContent = isWithCollapsibleContent(element)
  const clickSelector = getClickSelector(hasCollapsibleContent)
  const featureBenefitCardNodes = element.querySelectorAll(clickSelector)

  const accordionMenuHandler = (e: MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    const currentElement = hasCollapsibleContent
      ? (target.closest(FEATURE_BENEFIT_CARD_SELECTOR) as HTMLElement | null)
      : target

    if (!currentElement) {
      return
    }
    currentElement.classList.toggle('expanded')

    if (hasCollapsibleContent) {
      requestAnimationFrame(() => {
        toggleIconsVisibility(currentElement)
        resetOtherCards(currentElement)
        scrollCardIntoView(currentElement)
      })
    } else {
      currentElement.querySelector(DRAWER_ICONS_SELECTOR)?.classList.toggle('d-none')
    }
  }

  const removeAccordionMenuFeatureBenefitListeners = () => {
    featureBenefitCardNodes.forEach((el) => {
      el.removeEventListener('click', accordionMenuHandler)
    })
  }

  featureBenefitCardNodes.forEach((el) => {
    el.addEventListener('click', accordionMenuHandler)
  })

  return removeAccordionMenuFeatureBenefitListeners
}

const useFeatureBenefit = (): {
  initializeFeatureBenefit: (node: ParentNode) => void
  isWithCollapsibleContent: (node: ParentNode) => boolean
} => {
  const [node, setNode] = useState<ParentNode | null>(null)
  useEffect(() => {
    const cleanup = featureBenefit(node)
    return () => cleanup && cleanup()
  }, [node])
  return { initializeFeatureBenefit: setNode, isWithCollapsibleContent }
}

export { useFeatureBenefit }
