import { useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useUpdateAtom } from 'jotai/utils'
import { setOpenShopAssistChatRequestAtom } from 'store/shop-assist-chat.atom'
import usePreference from 'toro/hooks/usePreference_new'
import getPageTypeFlags from 'helpers/pageTypeFlags'
import { PageTypeFlags } from 'toro/types'
import { AiGiftConciergeAttributeName, AiGiftConciergeEventLocation } from 'toro/cms/constants'

/** Maps SFCC-style page flags to shop-assist analytics location strings (see AiGiftConciergeEventLocation). */
function eventLocationFromFlags(flags: PageTypeFlags): string {
  if (flags.isPDP) return AiGiftConciergeEventLocation.PDP
  if (flags.isSRP) return AiGiftConciergeEventLocation.SRP
  if (flags.isPLP) return AiGiftConciergeEventLocation.PLP
  if (flags.isContentPage) return AiGiftConciergeEventLocation.CLP
  if (flags.isShopBy) return AiGiftConciergeEventLocation.SHOP_BY
  if (flags.isHP) return AiGiftConciergeEventLocation.HOME
  return AiGiftConciergeEventLocation.UNKNOWN
}

/**
 * Wires CMS elements marked with "data-aigiftconcierge" to open Shop Assist with a page-type-derived
 * location. Uses "useRouter + getPageTypeFlags" instead of "pageTypeAtom" so HtmlContent does not
 * mount "basePathAtom".
 */
export function useGiftConciergeLauncher() {
  const router = useRouter()
  const { coachtopia: { coachtopiaHomeURL: subBrandHomeUrl = '' } = {} } = usePreference({
    coachtopia: ['coachtopiaHomeURL'],
  })
  const setOpenShopAssistChat = useUpdateAtom(setOpenShopAssistChatRequestAtom)

  // DOM listeners keep a stable function reference; refs hold the latest path prefs for each click.
  const navRef = useRef({ path: '', subBrandHomeUrl: '' })
  useEffect(() => {
    navRef.current = {
      path: (router.asPath ?? '').replace(/\?.+/, ''),
      subBrandHomeUrl: subBrandHomeUrl ?? '',
    }
  }, [router.asPath, subBrandHomeUrl])

  const cleanupRef = useRef<(() => void) | undefined>(undefined)
  // Unmount-only: do not fold this into the nav effect above—its cleanup would run on every route
  // or preferences change and detach listeners while HtmlContent is still mounted.
  useEffect(
    () => () => {
      cleanupRef.current?.()
      cleanupRef.current = undefined
    },
    []
  )

  const initializeAiGiftConciergeLauncher = useCallback(
    (root: HTMLElement | null): (() => void) | undefined => {
      // HtmlContent may call initialize again without unmounting; clear any previous listeners first.
      cleanupRef.current?.()
      cleanupRef.current = undefined
      if (!root) return undefined

      const attr = `[${AiGiftConciergeAttributeName}]`

      const useRoot = root.matches(attr)
      const targets = useRoot ? [root] : (Array.from(root.querySelectorAll(attr)) as HTMLElement[])
      if (!targets.length) return undefined

      const onClick = () => {
        const { path, subBrandHomeUrl } = navRef.current
        setOpenShopAssistChat(eventLocationFromFlags(getPageTypeFlags(path, subBrandHomeUrl)))
      }

      targets.forEach((el) => el.addEventListener('click', onClick))
      const cleanup = () => targets.forEach((el) => el.removeEventListener('click', onClick))

      cleanupRef.current = cleanup
      return cleanup
    },
    [setOpenShopAssistChat]
  )

  return initializeAiGiftConciergeLauncher
}
