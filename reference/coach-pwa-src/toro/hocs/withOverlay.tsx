import React, { type ComponentType } from 'react'
import ReactDOM from 'react-dom'
import Box from 'toro/components/Box'
import { EXPERIMENTS } from 'toro/constants/experiments'
import useExperiment from 'toro/hooks/useExperiment'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePageType from 'toro/hooks/usePageType'

interface OverlayConfig {
  showOverlay?: boolean
  onClick?: () => void
  overlayStyles?: Record<string, any>
  overlayTarget?: string
}

const withOverlay = function <T>(Component: ComponentType<T>, config?: OverlayConfig) {
  return (props: T & { closeDrawer: () => void }) => {
    const isPostATBMobileExperimentEnabled = useExperiment(EXPERIMENTS.POST_ATB_MOBILE)

    const styles = useMultiStyleConfig('AddToBagDrawer', {
      variant: isPostATBMobileExperimentEnabled ? 'postATBMobile' : undefined,
    })
    const { isPLP } = usePageType()
    const {
      showOverlay = true,
      onClick,
      overlayStyles,
      overlayTarget = 'maincontent',
    } = config || {}
    const handleClick = onClick || isPLP ? props.closeDrawer : undefined
    const overlay = overlayStyles || styles.bagDrawerOverlay

    return (
      <>
        {showOverlay &&
          ReactDOM.createPortal(
            <Box sx={overlay} onClick={handleClick} />,
            document.getElementById(overlayTarget)
          )}
        <Component {...(props as T)} />
      </>
    )
  }
}

export default withOverlay
