import { memo } from 'react'
import dynamic from 'next/dynamic'
import useViewportType from 'toro/hooks/useViewportType'

const HeaderMobile = dynamic(() => import('toro/components/header/Header/mobile'))
const HeaderDesktop = dynamic(() => import('toro/components/header/Header/desktop'))

function Header() {
  const { isMobile } = useViewportType()

  if (isMobile) {
    return <HeaderMobile />
  }

  return <HeaderDesktop />
}

export default memo(Header)
