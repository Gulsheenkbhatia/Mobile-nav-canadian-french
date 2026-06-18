import { useState, useEffect } from 'react'
import useDisclosure from 'toro/hooks/useDisclosure'
import useViewportType from 'toro/hooks/useViewportType'
import { MAIN_CONTENT } from 'toro/constants/appConstants'
import useTheme from 'toro/hooks/useTheme'
import Box from 'toro/components/Box'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import ModalCloseButton from 'toro/components/ModalCloseButton'

const DEFAULT_VIDEO_SETTINGS = '?autoplay=1&rel=0&showinfo=0&controls=1&modestbranding=0'
const YOUTUBE_VIDEO_SELECTOR = '.at-youtube-video'

const YoutubePlayer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isMobile } = useViewportType()
  const [videoSrc, setVideoSrc] = useState('')
  const { space } = useTheme()

  const onPosterClickHandler = (e) => {
    if (!isOpen) {
      const clickedElem = e.target.closest(`${YOUTUBE_VIDEO_SELECTOR}`)
      if (clickedElem) {
        const { desktopSrc, mobileSrc } = clickedElem.dataset
        if (!isMobile) {
          if (desktopSrc) {
            setVideoSrc(desktopSrc)
            onOpen()
          }
        } else {
          if (mobileSrc) {
            setVideoSrc(mobileSrc)
            onOpen()
          }
        }
      }
    }
  }

  useEffect(() => {
    const container = document.querySelector(`#${MAIN_CONTENT}`)

    if (container) {
      container.addEventListener('click', onPosterClickHandler)
      return () => container.removeEventListener('click', onPosterClickHandler)
    }
  }, [])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          sx={{
            maxWidth: isMobile ? '100%' : '82%',
            maxHeight: isMobile ? '55vh' : '100vh',
            margin: isMobile ? '0' : `${space.s10} auto 0`,
          }}
        >
          <Box className="responsive-iframe" id="youtubeVideo">
            <iframe
              className="youtubeIframe embed-responsive-item"
              src={`${videoSrc}${DEFAULT_VIDEO_SETTINGS}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </Box>
          <ModalCloseButton
            sx={{
              width: '32px',
              height: '32px',
              top: '-32px',
              right: '-2px',
              color: '#fff',

              '& svg': {
                width: '17px',
                height: '17px',
              },
            }}
          />
        </ModalContent>
      </Modal>
    </>
  )
}

export default YoutubePlayer
