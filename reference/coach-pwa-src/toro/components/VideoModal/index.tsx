import React, { useRef, FC } from 'react'
import { useAtomValue, useResetAtom } from 'jotai/utils'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'
import Video from 'toro/components/Video'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { videoModalSrcAtom } from 'store/global.atom'

const VideoModal: FC = () => {
  const styles = useMultiStyleConfig('VideoModal')
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoSrc = useAtomValue(videoModalSrcAtom)
  const resetVideoModalSrc = useResetAtom(videoModalSrcAtom)
  const isOpen = Boolean(videoSrc)

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    void resetVideoModalSrc()
  }

  if (!isOpen || !videoSrc) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      size="full"
      motionPreset="slideInBottom"
    >
      <ModalOverlay sx={styles.overlay} />
      <ModalContent sx={styles.content}>
        <ModalCloseButton sx={styles.closeButton} />
        <Video
          ref={videoRef}
          src={videoSrc}
          controls
          autoPlay
          playsInline
          controlsList="nodownload"
          sx={styles.video}
        />
      </ModalContent>
    </Modal>
  )
}

export default VideoModal
