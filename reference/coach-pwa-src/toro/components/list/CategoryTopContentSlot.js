import HtmlContent from 'toro/components/HtmlContent'
import Box from 'toro/components/Box'
import { useEffect, useContext, useRef } from 'react'
import {
  INIT_CALLBACK_NAME_TOP_SLOT,
  applyProductSwatchesClick,
  applySplideSliders,
} from 'toro/helpers/home'
import useViewportType from 'toro/hooks/useViewportType'
import PWAContext from 'components/common/PWAContext'

const CONTAINER_ID = 'plp-top-content'

const applyVideoSrc = (isDesktop) => {
  if (!window.$) {
    return
  }
  window.$('video').each((idx, item) => {
    const $item = window.$(item)
    $item.attr('src', $item.attr(`data-${isDesktop ? 'desktop' : 'mobile'}-video-src`))
  })
}

const onInit = (id, isDesktop) => {
  try {
    applySplideSliders(id)
    applyVideoSrc(isDesktop)
  } catch (e) {
    console.error('CategoryTopContentSlot onInit', e)
  }
}

export default function CategoryTopContentSlot({ content }) {
  const { isDesktop, isMobile } = useViewportType()
  const cleanupFunctionsRef = useRef([])
  const onPageInit = () => onInit(CONTAINER_ID, isDesktop, cleanupFunctionsRef)
  const { injectJquery } = useContext(PWAContext)

  const onMount = async () => {
    try {
      await injectJquery()
      window[INIT_CALLBACK_NAME_TOP_SLOT] = window[INIT_CALLBACK_NAME_TOP_SLOT] || onPageInit
      window[INIT_CALLBACK_NAME_TOP_SLOT]()
      applyProductSwatchesClick('category_top_content_slot')
    } catch (e) {
      console.log('Error when init category top content slot', e)
    }
  }
  useEffect(() => {
    onMount()
    return () => {
      if (cleanupFunctionsRef.current.length) {
        cleanupFunctionsRef.current.forEach((cleanupFn) => cleanupFn?.())
        cleanupFunctionsRef.current = []
      }
    }
  }, [isDesktop])

  const renderSlot = (slot) => {
    if (!slot) {
      return null
    }
    return <HtmlContent content={slot} lazyLoadVideos lazyLoadImages={isMobile} />
  }

  return (
    <>
      <Box w="100%" id={CONTAINER_ID} data-qa="plp_top_cslot" className="mwplp">
        {renderSlot(content)}
      </Box>
    </>
  )
}
