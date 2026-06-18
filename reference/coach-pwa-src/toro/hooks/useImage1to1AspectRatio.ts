import { useMemo } from 'react'
import usePreference from 'toro/hooks/usePreference_new'
import useHeaderPositionPref from 'toro/hooks/useHeaderPositionPref'
import useViewportType from 'toro/hooks/useViewportType'

const useImage1To1AspectRatio = (src = '') => {
  const {
    pdpPreferences: { imageType1to1AspectRatio },
  } = usePreference({
    PDPPreferences: ['imageType1to1AspectRatio'],
  })

  const { isTransparentStickyHeader } = useHeaderPositionPref()

  const { isMobile } = useViewportType()

  return useMemo(() => {
    if (!imageType1to1AspectRatio || !isTransparentStickyHeader || !src || !isMobile) {
      return
    }

    return !!imageType1to1AspectRatio
      .split(',')
      .find((imageType = '') => src.split('?')[0]?.endsWith(imageType))
  }, [src, isTransparentStickyHeader, isMobile, imageType1to1AspectRatio])
}

export default useImage1To1AspectRatio
