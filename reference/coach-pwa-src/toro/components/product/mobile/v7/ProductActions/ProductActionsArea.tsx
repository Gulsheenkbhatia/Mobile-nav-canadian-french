import { useEffect, useRef, useState, useMemo, memo } from 'react'
import { useInView } from 'react-intersection-observer'
import { useAtomValue } from 'jotai/utils'
import debounce from 'lodash/debounce'
import Box from 'toro/components/Box'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { hasErrorsAtom } from 'store/pdp.atom'
import { isPdpV7CharmsSectionInViewAtom } from 'store/pdpv7.atom'
import { isFooterVisibleAtom } from 'store/global.atom'
import { accessorizeItInViewAtom } from 'store/accessorizeIt.atom'
import ProductActions from 'toro/components/product/mobile/v7/ProductActions'

const ProductActionsArea = () => {
  const styles = useMultiStyleConfig('ProductActions')
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasScrolledToError, setHasScrolledToError] = useState(false)
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
  })

  const hasErrors = useAtomValue(hasErrorsAtom)
  const isFooterVisible = useAtomValue(isFooterVisibleAtom)
  const accessorizeItInView = useAtomValue(accessorizeItInViewAtom)
  const isPdpV7CharmsSectionInView = useAtomValue(isPdpV7CharmsSectionInViewAtom)

  // Reset scroll flag when errors are cleared
  useEffect(() => {
    if (!hasErrors) {
      setHasScrolledToError(false)
    }
  }, [hasErrors])

  const isSticky =
    !inView && !isFooterVisible && !accessorizeItInView && !isPdpV7CharmsSectionInView

  const debouncedScrollToError = useMemo(
    () =>
      debounce(() => {
        if (containerRef.current) {
          containerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
          setHasScrolledToError(true)
        }
      }, 100),
    []
  )

  useEffect(() => {
    return () => {
      debouncedScrollToError.cancel()
    }
  }, [debouncedScrollToError])

  useEffect(() => {
    if (hasErrors && !inView && !hasScrolledToError) {
      debouncedScrollToError()
    }
  }, [hasErrors, inView, hasScrolledToError, debouncedScrollToError])

  return (
    <>
      <div ref={sentinelRef} />
      <Box ref={containerRef}>
        <ProductActions />
      </Box>
      <Box sx={styles.productActionsAreaWrapperSticky} display={isSticky ? 'block' : 'none'}>
        <ProductActions isSticky />
      </Box>
    </>
  )
}

export default memo(ProductActionsArea)
