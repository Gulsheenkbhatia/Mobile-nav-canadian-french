import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { initAllVideoModals, setVideoModalCallback } from 'toro/helpers/initVideoModals'
import { videoModalSrcAtom } from 'store/global.atom'

export function useVideoModal() {
  const [, setVideoModalSrc] = useAtom(videoModalSrcAtom)

  const initVideoModalTriggers = useCallback(
    (el: HTMLElement): (() => void) | undefined => {
      if (!el) {
        return undefined
      }

      setVideoModalCallback((src: string) => {
        setVideoModalSrc(src)
      })
      return initAllVideoModals(el)
    },
    [setVideoModalSrc]
  )

  return {
    initVideoModalTriggers,
  }
}
