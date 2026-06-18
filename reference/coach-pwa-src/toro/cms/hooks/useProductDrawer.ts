import { useUpdateAtom } from 'jotai/utils'
import { useCallback } from 'react'
import { openProductDrawerAtom, closeProductDrawerAtom } from 'store/global.atom'

export function useProductDrawer() {
  const openDrawer = useUpdateAtom(openProductDrawerAtom)
  const closeDrawer = useUpdateAtom(closeProductDrawerAtom)

  const initProductDrawerTriggers = useCallback(
    (elt: HTMLElement): (() => void) | undefined => {
      if (!elt) return undefined

      const triggerElements = Array.from(
        elt.querySelectorAll('[data-drawer-trigger]')
      ) as HTMLElement[]

      if (!triggerElements.length && !elt.hasAttribute('data-drawer-trigger')) return undefined

      const elements = elt.hasAttribute('data-drawer-trigger') ? [elt] : triggerElements

      const handleClick = (e: Event) => {
        if (e.target instanceof Element) {
          const interactiveChild = e.target.closest('a, button:not([data-drawer-trigger])')
          if (interactiveChild && interactiveChild !== e.currentTarget) {
            return
          }
        }

        e.preventDefault()
        const target = e.currentTarget as HTMLElement
        const assetId = target.getAttribute('content-asset-id')

        openDrawer(assetId)
      }

      elements.forEach((element) => {
        element.addEventListener('click', handleClick)
      })

      return () => {
        elements.forEach((element) => {
          element.removeEventListener('click', handleClick)
        })
      }
    },
    [openDrawer]
  )

  return {
    openDrawer,
    closeDrawer,
    initProductDrawerTriggers,
  }
}
