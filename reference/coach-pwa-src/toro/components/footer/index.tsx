import dynamic from 'next/dynamic'
import Lazy from 'toro/components/Lazy'
import { memo, useContext, useEffect, useState } from 'react'

import PWAContext from 'components/common/PWAContext'
import useViewportType from 'toro/hooks/useViewportType'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'

const FooterContent = dynamic(() => import('toro/components/footer/Footer'), {
  ssr: false,
})

// Note: some dynamic content can change the distance of the footer from the bottom of the page.
// When an empty lazy content section is encountered, it's empty and can trigger rendering of the footer beforehand.
const BASE_OFFSET = 600
const MOBILE_OFFSET = 300
const DESKTOP_OFFSET = 1200

type FooterProps = {
  isErrorPage: boolean
}

function Footer({ isErrorPage }: FooterProps) {
  const { isMobile } = useViewportType()
  const { appData } = useContext(PWAContext)
  const { isReducedHeaderAndFooter } = appData
  const [lazyOffset, setLazyOffset] = useState(isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET)

  useEffect(() => {
    if (isErrorPage) {
      return
    }

    try {
      const viewportHeight = window.innerHeight
      const mainContainerHeight = document.getElementById('maincontent').clientHeight
      const deviceOffset = isMobile ? MOBILE_OFFSET : DESKTOP_OFFSET

      if (mainContainerHeight - viewportHeight > deviceOffset) {
        // we have enough content to show the footer with a delay
        setLazyOffset(deviceOffset)
      } else {
        // footer in the viewport immediately
        setLazyOffset(0)
      }
    } catch (e) {
      setLazyOffset(BASE_OFFSET)
    }
  }, [isMobile, isErrorPage])

  const isInitialInView = isErrorPage || lazyOffset === 0

  return (
    <Lazy
      className="footerContainer"
      rootMargin={`0px 0px ${lazyOffset}px`}
      showOnInit={isInitialInView}
      style={{ minHeight: isReducedHeaderAndFooter ? 158 : 400 }}
    >
      <FooterContent />
    </Lazy>
  )
}

export default withErrorBoundaryWrapper(memo(Footer))
