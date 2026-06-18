import { useInView } from 'react-intersection-observer'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useAtomValue } from 'jotai/utils'
import debounce from 'lodash/debounce'
import Box from 'toro/components/Box'
import AddToBagArea from 'toro/components/product/desktop/AddToBagArea'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { hasErrorsAtom } from 'store/pdp.atom'
import { isFooterVisibleAtom } from 'store/global.atom'
import { accessorizeItInViewAtom } from 'store/accessorizeIt.atom'

const AddToBagAreaWrapper = () => {
  const styles = useMultiStyleConfig('AddToBagArea')
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasScrolledToError, setHasScrolledToError] = useState(false)
  const [hasScrolledPast, setHasScrolledPast] = useState(false)
  const { ref, inView, entry } = useInView({
    threshold: 0,
    rootMargin: '0px 0px 0px 0px', // Trigger slightly before component is fully out of view
  })

  const hasErrors = useAtomValue(hasErrorsAtom)
  const isFooterVisible = useAtomValue(isFooterVisibleAtom)
  const accessorizeItInView = useAtomValue(accessorizeItInViewAtom)

  // Reset scroll flag when errors are cleared
  useEffect(() => {
    if (!hasErrors) {
      setHasScrolledToError(false)
    }
  }, [hasErrors])

  // Track whether user has scrolled past the component
  useEffect(() => {
    if (entry) {
      // Hide sticky container if user above the static ATB
      if (!inView && entry.boundingClientRect.top < 0) {
        setHasScrolledPast(true)
      }
      // Show sticky container if user below the static ATB
      else if (inView || entry.boundingClientRect.top >= 0) {
        setHasScrolledPast(false)
      }
    }
  }, [inView, entry])

  const isSticky = hasScrolledPast && !isFooterVisible && !accessorizeItInView

  const debouncedScrollToError = useCallback(
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
    if (hasErrors && !inView && !hasScrolledToError) {
      debouncedScrollToError()
    }
  }, [hasErrors, inView, hasScrolledToError, debouncedScrollToError])

  return (
    <>
      <Box
        ref={(node) => {
          ref(node)
          containerRef.current = node
        }}
      >
        <Box sx={styles.addToBagAreaWrapper}>
          <AddToBagArea />
        </Box>
      </Box>
      <Box sx={styles.addToBagAreaWrapperSticky} display={isSticky ? 'block' : 'none'}>
        <AddToBagArea isSticky={isSticky} />
      </Box>
    </>
  )
}

export default AddToBagAreaWrapper
