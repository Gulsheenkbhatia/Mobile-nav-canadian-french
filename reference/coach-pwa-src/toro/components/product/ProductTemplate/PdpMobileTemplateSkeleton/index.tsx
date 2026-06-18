import React, { memo } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Skeleton from 'toro/components/Skeleton'
import Hidden from 'toro/components/Hidden'
import { Spacer } from '@chakra-ui/layout'
import useViewportType from 'toro/hooks/useViewportType'

function PdpMobileTemplateSkeleton() {
  const { isDesktop } = useViewportType()
  const slot = (
    <Flex>
      <Box w="35%" ml={isDesktop ? '-8px' : '12px'}>
        <Skeleton height="19px" margin="24px 9px 5px" />
      </Box>
      <Spacer />
      <Box w="52%">
        <Skeleton height="16px" margin="26px 12px 6px 0" />
        <Skeleton height="16px" margin="5px 12px 6px 0" />
        <Skeleton height="16px" margin="6px 12px 6px 0" />
        <Skeleton height="16px" margin="6px 12px 48px 0" />
      </Box>
    </Flex>
  )

  const сontentAreaOnMobile = (
    <Box m="42px">
      <Box>
        <Skeleton height="241px" width="100%">
          <Box mb="mar" />
        </Skeleton>
      </Box>
      <Box>
        <Skeleton height="23px" width="100%" mt="22px" mb="22px">
          <Box mb="mar" />
        </Skeleton>
      </Box>
      <Box>
        <Skeleton height="40px" width="100%">
          <Box mb="mar" />
        </Skeleton>
      </Box>
    </Box>
  )

  return (
    <>
      <Hidden onDesktop>
        <Flex>
          <Skeleton width="11%" height="16px" margin="15px 22px 8px 12px" />
          <Skeleton width="15%" height="16px" margin="15px 20px 8px 1px" />
          <Skeleton width="42%" height="16px" margin="15px 32px 8px 9px" />
        </Flex>
        <Skeleton width="80%" height="24px" margin="8px 29px 8px 12px" />
        <Flex>
          <Skeleton width="33%" height="16px" margin="8px 16px 16px 12px" />
          <Spacer />
          <Skeleton width="33%" height="16px" margin="8px 16px 16px 12px" />
        </Flex>
        <Skeleton width="100%" height="469px" margin="16px 0" />
        <Skeleton width="17%" height="34px" margin="16px 1px 8px 12px" />
        <Skeleton width="85%" height="17px" margin="8px 11px 16px 12px" />
        <Skeleton width="61%" height="17px" margin="16px 4px 24px 12px" />
        <Flex>
          <Skeleton width="33%" height="20px" margin="24px 16px 8px 12px" />
          <Skeleton width="33%" height="20px" margin="24px 12px 8px 10px" />
        </Flex>
        <Flex>
          <Skeleton width="21%" height="95px" margin="8px 4px 24px 12px" />
          <Skeleton width="21%" height="95px" margin="8px 4px 24px" />
          <Skeleton width="21%" height="95px" margin="8px 4px 24px" />
          <Skeleton width="21%" height="95px" margin="8px 4px 24px" />
          <Skeleton width="7%" height="95px" margin="8px 0 24px 4px" />
        </Flex>
        <Skeleton width="94%" height="48px" margin="24px 12px 12px" />
        <Flex>
          <Skeleton width="45%" height="48px" margin="12px 12px 25px" />
          <Skeleton width="45%px" height="48px" margin="12px 12px 25px" />
        </Flex>
        <Skeleton width="85%" height="17px" margin="25px 11px 8px 12px" />
        <Skeleton width="85%px" height="19px" margin="8px 11px 42px 12px" />
        <Skeleton width="94%" height="19px" margin="42px 12px 36px" />
        <Skeleton width="94%" height="19px" margin="36px 12px 24px" />
        {[slot, slot, slot]}
        <Skeleton width="60%" height="20px" margin="27px 0 40px 12px" />
        <Skeleton width="94%" height="19px" margin="40px 12px 38px" />
        <Flex>
          <Box w="100%">
            <Skeleton width="156px" height="20px" margin="38px 0 41px 12px" />
          </Box>
          <Box w="100%">
            <Flex>
              <Skeleton width="20px" height="20px" margin="38px 20px 41px 16px" />
              <Skeleton width="20px" height="20px" margin="38px 28px 41px 4px" />
              <Skeleton width="20px" height="20px" margin="38px 28px 41px 4px" />
              <Skeleton width="20px" height="20px" margin="38px 13px 41px 11px" />
            </Flex>
          </Box>
        </Flex>
        <hr />
        <Box>{сontentAreaOnMobile}</Box>
        <hr />
        <Box>{сontentAreaOnMobile}</Box>
        <hr />
      </Hidden>
    </>
  )
}

export default memo(PdpMobileTemplateSkeleton)
