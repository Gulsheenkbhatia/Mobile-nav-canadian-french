import { useEffect } from 'react'
import { addMediaAssetListeners, removeMediaAssetListeners } from 'toro/helpers/mediaAssets'
import useViewportType from 'toro/hooks/useViewportType'

const useMediaAssetContent = () => {
  const { isDesktop } = useViewportType()

  useEffect(() => {
    addMediaAssetListeners(isDesktop)

    return () => {
      removeMediaAssetListeners()
    }
  }, [])
}

export default useMediaAssetContent
