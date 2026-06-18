import { useEffect, useContext } from 'react'
import PWAContext from 'components/common/PWAContext'

type UseSplideCarouselProps = {
  shouldInjectSplide: boolean
}

const useSplideCarousel = ({ shouldInjectSplide }: UseSplideCarouselProps): void => {
  const { injectJquery } = useContext(PWAContext)

  useEffect(() => {
    if (!shouldInjectSplide) {
      return
    }

    const doInjectJquery = async () => {
      try {
        await injectJquery()
      } catch (e) {
        console.log('Error initializing Splide', e)
      }
    }

    doInjectJquery()
  }, [shouldInjectSplide])
}

export default useSplideCarousel
