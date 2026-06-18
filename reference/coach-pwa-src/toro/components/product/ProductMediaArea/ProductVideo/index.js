import Video from 'toro/components/Video'
import Button from 'toro/components/Button'
import MediaPlayOverlay from 'toro/components/product/ProductMediaArea/MediaPlayOverlay'
import React, { useRef, useState, useEffect } from 'react'
import get from 'lodash/get'
import AspectRatio from 'toro/components/AspectRatio'
import { useInView } from 'react-intersection-observer'
import PropTypes from 'prop-types'

/**
 * Renders large product video in PDP media carousel
 *
 * @param  {Boolean} isActive flag to indicate that item is currently shown for user
 */
const ProductVideo = ({ isActive, ...props }) => {
  const videoElementRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState()
  const [inViewRef] = useInView({
    onChange: (isVisible) => {
      if (isVisible !== isPlaying) {
        togglePlayPause()
      }
    },
  })

  function togglePlayPause() {
    const videoElement = get(videoElementRef, 'current', {})
    if (get(videoElement, 'paused', false)) {
      setIsPlaying(true)
      videoElement.play()
    } else {
      setIsPlaying(false)
      videoElement.pause()
    }
  }

  useEffect(() => {
    const videoElement = get(videoElementRef, 'current', {})
    setIsPlaying(false)
    videoElement.pause()
    videoElement.currentTime = 0
  }, [isActive])

  return (
    <AspectRatio ratio={3 / 4}>
      <Button ref={inViewRef} variant="unstyled" onClick={togglePlayPause} h="auto">
        {!isPlaying && <MediaPlayOverlay size="lg" />}
        <Video ref={videoElementRef} {...props} preload={isActive ? 'auto' : 'none'} />
      </Button>
    </AspectRatio>
  )
}
ProductVideo.propTypes = {
  isActive: PropTypes.bool,
}
export default ProductVideo
