import { useRef } from 'react'
import useOutsideClick from 'toro/hooks/useOutsideClick'
import Box from 'toro/components/Box'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

function SlidingUpPopup({ children, isFlyoutOpen, setFlyoutOpen, variant, ...props }) {
  const styles = useMultiStyleConfig('SlidingUpPopup', { variant })
  const containerRef = useRef(null)

  useOutsideClick({
    ref: containerRef,
    enabled: isFlyoutOpen,
    handler: (e) => {
      if (isFlyoutOpen) {
        setFlyoutOpen(false)
        e.preventDefault()
      }
    },
  })

  const overlayStylingProps = isFlyoutOpen ? styles.overlayContainer : styles.overlayContainerHidden

  const stickyContainerStylingProps = isFlyoutOpen
    ? styles.stickyContainer
    : {
        display: 'none',
      }

  return (
    <Box {...props} data-qa="pdp_sticky-container">
      <Box sx={overlayStylingProps} id="drawer-bottom">
        <Box
          data-qa="m_pdp_section_variant_drawer"
          ref={containerRef}
          id="pdp-sticky-container"
          sx={stickyContainerStylingProps}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default withErrorBoundaryWrapper(SlidingUpPopup)
