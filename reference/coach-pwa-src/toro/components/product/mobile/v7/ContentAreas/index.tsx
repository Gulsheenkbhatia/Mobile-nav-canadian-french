import React, { useContext } from 'react'
import dynamic from 'next/dynamic'
import Box from 'toro/components/Box'
import useProductData from 'toro/hooks/useProductData'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'

const ContentAreaOne = dynamic(() => import('toro/components/product/ContentArea/ContentAreaOne'), {
  ssr: false,
})
const ContentAreaTwo = dynamic(() => import('toro/components/product/ContentArea/ContentAreaTwo'), {
  ssr: false,
})
const ContentAreaThree = dynamic(
  () => import('toro/components/product/ContentArea/ContentAreaThree'),
  { ssr: false }
)

export type SketchContentAreaSlot = 1 | 2 | 3

const CONTENT_PATHS: Record<SketchContentAreaSlot, [slotPath: string, customAttrPath: string]> = {
  1: ['pdpContentAreas.pdp-content-area-one-markup', 'custom.c_pdpContentAreaOne'],
  2: ['pdpContentAreas.pdp-content-area-two-markup', 'custom.c_pdpContentAreaTwo'],
  3: ['pdpContentAreas.pdp-content-area-three-markup', 'custom.c_pdpContentAreaThree'],
}

export type ContentAreasProps = {
  area: SketchContentAreaSlot
}

const ContentAreas = ({ area }: ContentAreasProps) => {
  const { appData } = useContext(PWAContext)
  const siteId = get(appData, 'siteId')

  const [content, contentAreaCustomAttribute] = useProductData(CONTENT_PATHS[area])

  if (contentAreaCustomAttribute == null) {
    return null
  }

  const shared = {
    siteId,
    content,
    contentAreaCustomAttribute,
  }

  return (
    <Box w="100%" maxW="100%" data-qa={`sketch-content-areas-${area}`}>
      {area === 1 ? (
        <ContentAreaOne {...shared} />
      ) : area === 2 ? (
        <ContentAreaTwo {...shared} />
      ) : (
        <ContentAreaThree {...shared} />
      )}
    </Box>
  )
}

export default ContentAreas
