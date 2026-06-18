import React from 'react'
import Flex from 'toro/components/Flex'
import HtmlContent from 'toro/components/HtmlContent'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useProductData from 'toro/hooks/useProductData'

const SKETCH_MARKUP_PATH = 'contentAreaPDPv7SketchShot.c_body.default.markup'
const SKETCH_ONLINE_PATH = 'contentAreaPDPv7SketchShot.online.default'

const SketchContainer = () => {
  const styles = useMultiStyleConfig('SketchContainer')
  const [markup, isOnline] = useProductData([SKETCH_MARKUP_PATH, SKETCH_ONLINE_PATH])

  if (!isOnline || !markup?.trim()) {
    return null
  }

  return (
    <Flex className="sketch-container" sx={styles.SketchContainer} data-qa="sketch-container">
      <HtmlContent
        content={markup}
        data-qa="sketch-container-asset"
        lazyLoadImages
        lazyLoadVideos
      />
    </Flex>
  )
}

export default SketchContainer
