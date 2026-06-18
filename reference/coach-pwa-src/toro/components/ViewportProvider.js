import React, { useState, useEffect, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import { useBreakpointValue } from '@chakra-ui/react'
import PWAContext from 'components/common/PWAContext'
import ViewportContext from 'toro/components/ViewportContext'
import useIsTouchDevice from 'toro/hooks/useIsTouchDevice'

export default function ViewportProvider({ children, isAmplience, desktopBreakpoint = 'md' }) {
  const pwaState = useContext(PWAContext)
  const { isTouchDevice } = useIsTouchDevice()
  const deviceType = get(pwaState, 'deviceType')

  const deviceTypeIsMobile = deviceType === 'smartphone' || deviceType === 'mobile'
  const [viewport, setViewport] = useState(deviceTypeIsMobile ? 'mobile' : deviceType)
  const chakraViewport = useBreakpointValue(
    {
      base: 'mobile',
      [desktopBreakpoint]: 'desktop',
    },
    {
      fallback: deviceTypeIsMobile ? 'base' : desktopBreakpoint,
      ssr: false,
    }
  )
  const updateViewport = () => {
    const newViewport = chakraViewport

    if (newViewport === viewport || !newViewport) {
      return
    }
    setViewport(newViewport)
  }

  useEffect(() => {
    updateViewport()
  }, [chakraViewport])

  const context = useMemo(() => {
    let calculatedViewport = viewport
    if (isAmplience) {
      calculatedViewport = chakraViewport
    }
    return {
      viewport: calculatedViewport,
      isMobile: calculatedViewport === 'mobile',
      isTablet: calculatedViewport === 'tablet', // it's false allways
      isDesktop: calculatedViewport === 'desktop',
      isTouchDevice,
    }
  }, [viewport, isTouchDevice, chakraViewport, isAmplience])
  return <ViewportContext.Provider value={context}>{children}</ViewportContext.Provider>
}

ViewportProvider.propTypes = {
  /**
   * A URL to fetch when the app mounts which establishes a user session and returns user and cart data
   */
  url: PropTypes.string,
}
