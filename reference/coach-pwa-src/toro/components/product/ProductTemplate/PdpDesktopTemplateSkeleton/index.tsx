import { memo } from 'react'
import Skeleton from 'toro/components/Skeleton'
import Box from 'toro/components/Box'
import FullStar from 'design-tokens/icon/review/star.svg'

const Divider = () => {
  return (
    <Box
      sx={{
        w: '1px',
        h: 'var(--spacing-4)',
        opacity: '0.2',
        background: 'var(--color-black-base)',
      }}
    />
  )
}

function PdpDesktopTemplateSkeleton() {
  return (
    <Box
      height="100vh"
      style={{
        backgroundColor: 'var(--color-page-bg)',
      }}
    >
      <Box height="510px" display="flex" gap="75px" mx="75px" mb="calc(100vh - 510px)">
        <Skeleton
          width="100%"
          style={{
            borderRadius: '18px',
          }}
        />
        <Skeleton
          width="100%"
          style={{
            borderRadius: '18px',
          }}
        />
        <Skeleton
          width="100%"
          style={{
            borderRadius: '18px',
          }}
        />
      </Box>
      <Box
        position="fixed"
        bottom={0}
        left="50%"
        width="min(100%, 1440px)"
        height="108px"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        style={{
          transform: 'translateX(-50%)',
          background: 'white',
          borderRadius: '24px 24px 0px 0px',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap="var(--spacing-2)"
          p="var(--spacing-3)"
          pl="17px"
        >
          <Box display="flex" flexDirection="column" gap="var(--spacing-1)">
            <Box display="flex" alignItems="center" mb="var(--spacing-2)" gap="var(--spacing-2)">
              <FullStar width="12px" height="12px" />
              <Skeleton width="150px" height="16px" />
            </Box>
            <Skeleton width="280px" height="12px" />
          </Box>
          <Divider />
          <Box>
            <Skeleton width="150px" height="16px" />
          </Box>
          <Divider />
          <Box>
            <Skeleton width="250px" height="72px" />
          </Box>
          <Divider />
          <Box display="flex" gap="var(--spacing-2)">
            <Skeleton width="150px" height="50px" style={{ borderRadius: '800px' }} />
            <Skeleton width="150px" height="50px" style={{ borderRadius: '800px' }} />
          </Box>
        </Box>
        <Skeleton width="100%" height="34px" />
      </Box>
    </Box>
  )
}

export default memo(PdpDesktopTemplateSkeleton)
