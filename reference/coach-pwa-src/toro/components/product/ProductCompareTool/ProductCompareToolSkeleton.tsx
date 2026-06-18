import { memo, useMemo } from 'react'
import Skeleton from 'toro/components/Skeleton'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import Text from 'toro/components/Text'
import { WaysToWearItIcon, WhatFitsInsideIcon } from 'toro/icons'
import useViewportType from 'toro/hooks/useViewportType'

function ProductCompareToolSkeleton() {
  const style = useStyleConfig('ProductCompareTool')
  const { isDesktop } = useViewportType()

  const skeletonItem = useMemo(
    () => (
      <Box width="inherit">
        <Box position="relative">
          <Skeleton mb="9px" sx={style.skeletonImageWrapper}>
            <Box />
          </Skeleton>
          <Skeleton h="17px" mb="8px">
            <Box />
          </Skeleton>
          <Skeleton h="17px" mb="8px">
            <Box />
          </Skeleton>
          <Skeleton h="17px" mb="7px">
            <Box />
          </Skeleton>
        </Box>
        <Box sx={style.productMaterialWrapper}>
          <Skeleton h="38px" mb="10px">
            <Box />
          </Skeleton>
          <Box textAlign="center" width="100%">
            <Text sx={style.productMaterialTitle}>Material</Text>
            <Skeleton h="14px">
              <Box />
            </Skeleton>
          </Box>
        </Box>
        <Flex sx={style.producWhatFitsInsideWrapper}>
          <WaysToWearItIcon width="27px" height="26px" />
          <Box textAlign="center" width="100%">
            <Text sx={style.productWhatFitsInsideTitle}>What fits inside</Text>
            <Skeleton h="14px" mb="7px">
              <Box />
            </Skeleton>
          </Box>
        </Flex>
        <Flex sx={style.producWhatFitsInsideWrapper}>
          <WhatFitsInsideIcon width="34px" height="33px" />
          <Box textAlign="center" width="100%">
            <Text sx={style.productWhatFitsInsideTitle}>Ways to wear it</Text>
            <Skeleton h="14px" mb="7px">
              <Box />
            </Skeleton>
          </Box>
        </Flex>
      </Box>
    ),
    []
  )

  return (
    <Flex sx={style.similarProductsWrapper}>
      {Array.from({ length: isDesktop ? 4 : 2 }).map((_item, index) => (
        <Box key={index} ml="var(--spacing-3)" width={isDesktop ? '100%' : '34.8vw'}>
          {skeletonItem}
        </Box>
      ))}
    </Flex>
  )
}

export default memo(ProductCompareToolSkeleton)
