import { useContext, useEffect, useMemo, useState } from 'react'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'

const useIsTouchDevice = () => {
  const pwaState = useContext(PWAContext)
  const deviceType = get(pwaState, 'deviceType')
  const [isTouchDevice, setIsTouchDevice] = useState(
    deviceType === 'smartphone' || deviceType === 'mobile'
  )

  useEffect(() => {
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    setIsTouchDevice(isTouchDevice)
  }, [])

  return useMemo(() => ({ isTouchDevice }), [isTouchDevice])
}

export default useIsTouchDevice
