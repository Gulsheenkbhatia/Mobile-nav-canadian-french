import React, { memo, useContext, useMemo } from 'react'
import Box from 'toro/components/Box'
import Skeleton from 'toro/components/Skeleton'
import Grid from 'toro/components/Grid'
import useViewportType from 'toro/hooks/useViewportType'
import usePreference from 'toro/hooks/usePreference'
import { PAGE_SIZE_FOR_DESKTOP, PAGE_SIZE_FOR_DEVICE } from 'toro/site-preferences'
import { getSiteValueFromPref } from 'toro/helpers/preferences'
import PWAContext from 'components/common/PWAContext'
import get from 'lodash/get'
import { isCompletePlpV3DesktopAtom } from 'store/plp.atom'
import { useAtomValue } from 'jotai/utils'

function ProductsListSkeleton({ hidden }) {
  const { isDesktop } = useViewportType()
  const { appData } = useContext(PWAContext)
  const siteId = useMemo(() => get(appData, 'siteId'), [appData])
  const desktopPageSizePref = usePreference({
    groupId: 'productSearchPageSize',
    preferenceId: PAGE_SIZE_FOR_DESKTOP,
  })
  const devicePageSizePref = usePreference({
    groupId: 'productSearchPageSize',
    preferenceId: PAGE_SIZE_FOR_DEVICE,
  })
  const desktopLimit = getSiteValueFromPref(desktopPageSizePref, siteId, 16)
  const deviceLimit = getSiteValueFromPref(devicePageSizePref, siteId, 10)
  const pageSize = isDesktop ? +desktopLimit : +deviceLimit
  const isCompletePlpV3Desktop = useAtomValue(isCompletePlpV3DesktopAtom)

  const skeletonItems = useMemo(() => {
    const items = []
    for (let step = 0; step < pageSize; step++) {
      items.push(
        <Box key={`skeleton-wrapper-${step}`}>
          <Skeleton height={isDesktop ? 236 : 160} width="100%">
            <Box mb="mar" />
          </Skeleton>
          <Skeleton height="16px" width="100%">
            <Box mb="mar" />
          </Skeleton>
          <Skeleton height="24px" width="100%">
            <Box mb="mar" />
          </Skeleton>
        </Box>
      )
    }
    return items
  }, [pageSize])

  return (
    <Grid
      display={hidden ? 'none' : 'grid'}
      columnGap="mar"
      rowGap="xl"
      mb="2xl"
      width="100%"
      templateColumns={isDesktop ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)'}
      marginX={isCompletePlpV3Desktop ? 'auto' : undefined}
      maxWidth={isCompletePlpV3Desktop ? '1344px' : '100%'}
    >
      {skeletonItems}
    </Grid>
  )
}

export default memo(ProductsListSkeleton)
