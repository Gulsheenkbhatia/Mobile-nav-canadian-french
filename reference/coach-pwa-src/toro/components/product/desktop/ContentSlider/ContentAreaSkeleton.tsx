import { FC } from 'react'
import Box from 'toro/components/Box'
import Skeleton from 'toro/components/Skeleton'
import Hidden from 'toro/components/Hidden'

const ContentAreaSkeleton: FC = () => (
  <Hidden onDesktop>
    <Box m="42px 0" height="537px">
      <Box>
        <Skeleton height="537px" width="100%" />
      </Box>
    </Box>
  </Hidden>
)

export default ContentAreaSkeleton
