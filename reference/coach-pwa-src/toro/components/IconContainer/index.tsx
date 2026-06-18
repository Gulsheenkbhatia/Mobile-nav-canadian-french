import React, { ComponentType, useMemo } from 'react'
import Box from 'toro/components/Box'
import { useAtomValue } from 'jotai/utils'
import { iconIdsMap } from 'toro/icons'
import { usedIconsAtom } from 'store/icons.atom'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import parsedCmsIcons from 'toro/icons/cms-icons'
import parsedHeaderMobileIcons from 'toro/icons/header-mobile-icons'
import parsedSharedIcons from 'toro/icons/shared-icons'
import useViewportType from 'toro/hooks/useViewportType'

const renderIcon = (id: IconId) => {
  const Icon = iconIdsMap.get(id)
  if (!Icon) return null
  return <Icon id={`icon-${id}`} key={id} width="100%" height="100%" />
}

const IconContainer: ComponentType = () => {
  const { isMobile } = useViewportType()
  const usedIconsSet = useAtomValue(usedIconsAtom)
  const dynamicIcons = useMemo(() => usedIconsSet.map(renderIcon), [usedIconsSet.join()])

  return (
    <Box w="0" h="0" position="absolute" overflow="hidden" id="icon-container">
      {dynamicIcons}
      <div dangerouslySetInnerHTML={{ __html: parsedCmsIcons }} />
      <div dangerouslySetInnerHTML={{ __html: parsedSharedIcons }} />
      {isMobile && <div dangerouslySetInnerHTML={{ __html: parsedHeaderMobileIcons }} />}
    </Box>
  )
}

export default withErrorBoundaryWrapper(IconContainer)
