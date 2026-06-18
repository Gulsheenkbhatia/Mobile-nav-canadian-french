import isFinite from 'lodash/isFinite'
import { useCallback } from 'react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { bannerHeightAtom, isHeadroomActiveAtom } from 'store/headroom.atom'
import useTimeout from 'toro/hooks/useTimeout'

const useScrollWithHeadroomDisabled = () => {
  const bannerHeight = useAtomValue(bannerHeightAtom)
  const setIsHeadroomActive = useUpdateAtom(isHeadroomActiveAtom)
  const { start: activateHeadroomWithDelay } = useTimeout(() => setIsHeadroomActive(true), 100)

  return useCallback(
    (opts: ScrollToOptions) => {
      if (!opts) return

      setIsHeadroomActive(false)

      window.scrollTo({
        ...opts,
        top: isFinite(opts?.top) ? opts?.top : bannerHeight,
      })

      activateHeadroomWithDelay()
    },
    [bannerHeight]
  )
}

export default useScrollWithHeadroomDisabled
