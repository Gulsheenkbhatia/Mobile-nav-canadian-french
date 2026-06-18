import React, { memo, useMemo } from 'react'
import Box from 'toro/components/Box'
import Skeleton from 'toro/components/Skeleton'
import Grid from 'toro/components/Grid'

function ShopAssistSkeleton() {
  const skeletonItems = useMemo(() => {
    const itemCount = 4

    return Array.from({ length: itemCount }, (_, index) => (
      <Box
        key={`product-skeleton-${index}`}
        backgroundColor="surface.subtle"
        borderRadius="20px"
        p="sm"
        width="100%"
        mb="var(--spacing-3)"
      >
        <Box
          backgroundColor="#FFF"
          borderRadius="16px"
          p="mar"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="mar"
        >
          <Skeleton width="136px" height="172px" borderRadius="12px" flexShrink={0} />

          <Box display="flex" flexDirection="column" justifyContent="center" gap="xs" width="100%">
            <Skeleton height="20px" width="100%" />
            <Skeleton height="20px" width="80%" />

            <Box display="flex" alignItems="center" gap="xs" mt="xs">
              <Skeleton height="18px" width="25%" />
            </Box>
          </Box>
        </Box>
      </Box>
    ))
  }, [])

  return (
    <Box width="100%">
      <Grid width="100%" templateColumns="repeat(2, 1fr)" gap="var(--spacing-3)">
        {skeletonItems}
      </Grid>

      <Box mb="var(--spacing-6)">
        <Skeleton height="20px" width="95%" mb="xs" />
        <Skeleton height="20px" width="85%" mb="xs" />
        <Skeleton height="20px" width="60%" />
      </Box>
    </Box>
  )
}

export default memo(ShopAssistSkeleton)
