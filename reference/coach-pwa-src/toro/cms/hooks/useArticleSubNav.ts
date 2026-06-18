import { useAtomValue } from 'jotai/utils'
import { useCallback, useEffect, useState } from 'react'
import { isHeaderHeightAtom, isHeaderHiddenAtom } from 'store/headroom.atom'
import { MOL_ARTICLE_SUB_NAV } from 'toro/cms/constants'

export const ARTICLE_SUB_NAV_HTML_IDENTIFIER = `.${MOL_ARTICLE_SUB_NAV}`

const STICKY_CLASS = 'article-sub-nav--sticky'
const ARTICLE_HUB_SECTION_CLASS = 'article-hub__section'
const COMPONENT_BLOCK_CLASS = 'component-block'

export const useArticleSubNav = () => {
  const [node, setNode] = useState<ParentNode | null>(null)
  const headerHeight = useAtomValue(isHeaderHeightAtom)
  const isHeaderHidden = useAtomValue(isHeaderHiddenAtom)
  const stickyTop = isHeaderHidden ? 0 : headerHeight - 1

  useEffect(() => {
    if (!node) return

    const subNav =
      node instanceof HTMLElement && node.matches(`.${MOL_ARTICLE_SUB_NAV}`)
        ? node
        : node.querySelector<HTMLElement>(`.${MOL_ARTICLE_SUB_NAV}`)
    if (!subNav) return

    const container =
      subNav.closest<HTMLElement>(`.${ARTICLE_HUB_SECTION_CLASS}`) ||
      subNav.closest<HTMLElement>(`.${COMPONENT_BLOCK_CLASS}`)
    if (!container) return

    container.classList.remove('component-block--sticky-sub-nav')
    container.style.removeProperty('--sub-nav-top')
    const originalTop = container.getBoundingClientRect().top + window.scrollY

    container.classList.add('component-block--sticky-sub-nav')
    container.style.setProperty('--sub-nav-top', `${stickyTop}px`)

    let wasStuck = false

    const updateStickyClass = (): void => {
      const threshold = originalTop - stickyTop
      const isStuck = window.scrollY > threshold + 2
      if (isStuck !== wasStuck) {
        subNav.classList.toggle(STICKY_CLASS, isStuck)
        wasStuck = isStuck
      }
    }

    updateStickyClass()

    window.addEventListener('scroll', updateStickyClass, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateStickyClass)
      container.classList.remove('component-block--sticky-sub-nav')
      container.style.removeProperty('--sub-nav-top')
      subNav.classList.remove(STICKY_CLASS)
    }
  }, [node, stickyTop])

  const initializeNode = useCallback((parentNode: HTMLElement) => {
    if (!parentNode) return
    const subNav = parentNode.querySelector<HTMLElement>(`.${MOL_ARTICLE_SUB_NAV}`)
    if (subNav || parentNode.matches(`.${MOL_ARTICLE_SUB_NAV}`)) {
      setNode(parentNode)
    }
  }, [])

  return initializeNode
}
