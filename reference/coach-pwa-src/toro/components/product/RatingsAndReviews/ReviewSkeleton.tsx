import { memo, Fragment } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Skeleton from 'toro/components/Skeleton'
import useViewportType from 'toro/hooks/useViewportType'

interface ReviewSkeletonProps {
  count?: number
  isHeaderContent?: boolean
}

function ReviewSkeleton({ count, isHeaderContent }: ReviewSkeletonProps) {
  const { isDesktop } = useViewportType()
  const bgColor = 'var(--neutrals-color-neutral-light)'

  return isHeaderContent ? (
    <>
      <Flex
        justify="center"
        mt={isDesktop ? '32px' : '16px'}
        mb="32px"
        direction="column"
        align="center"
      >
        <Skeleton width="152px" height="55px" margin="8px 29px 8px 12px" />
        <Box ml="16px">
          <Skeleton width="141px" height="24px" margin="8px 29px 8px 12px" bg={bgColor} />
          {Array(2)
            .fill(0)
            .map((_, i) => (
              <Fragment key={i}>
                <Skeleton
                  width={isDesktop ? '530px' : '351px'}
                  height="12px"
                  margin="8px 29px 8px 12px"
                  bg={bgColor}
                />
                <Skeleton width="39px" height="12px" margin="8px 29px 24px 12px" bg={bgColor} />
              </Fragment>
            ))}
        </Box>
      </Flex>
    </>
  ) : (
    <>
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <Fragment key={i}>
            <Flex flexDirection={isDesktop ? 'row' : 'column'} pt="40px" pb="40px">
              <Box mb="16px" width={isDesktop ? '30%' : '100%'}>
                <Skeleton width="152px" height="22px" margin="8px 29px 8px 12px" bg={bgColor} />
                <Skeleton width="126px" height="12px" margin="8px 29px 8px 12px" bg={bgColor} />
                <Skeleton width="106px" height="12px" margin="8px 29px 8px 12px" bg={bgColor} />
                <Skeleton width="106px" height="12px" margin="8px 29px 8px 12px" bg={bgColor} />
                <Skeleton
                  width={isDesktop ? '120px' : '94px'}
                  height="12px"
                  margin="8px 29px 8px 12px"
                  bg={bgColor}
                />
              </Box>

              <Box width={isDesktop ? '70%' : '100%'} marginLeft={isDesktop ? '24px' : ''}>
                <Box mb="16px">
                  <Skeleton width="261px" height="22px" margin="8px 29px 8px 12px" bg={bgColor} />

                  <Skeleton
                    width={isDesktop ? '688px' : '325px'}
                    height="15px"
                    margin="8px 29px 8px 12px"
                    bg={bgColor}
                  />
                  <Skeleton
                    width={isDesktop ? '618px' : '310px'}
                    height="15px"
                    margin="8px 29px 8px 12px"
                    bg={bgColor}
                  />
                </Box>

                <Flex
                  justify="between"
                  align="center"
                  width="216px"
                  height="15px"
                  margin="8px 29px 8px 12px"
                >
                  <Skeleton width="56px" height="15px" marginRight="12px" bg={bgColor} />
                  <Skeleton width="56px" height="15px" marginRight="12px" bg={bgColor} />
                  <Skeleton width="56px" height="15px" marginRight="12px" bg={bgColor} />
                </Flex>
              </Box>
            </Flex>
            <Box mt="31px" borderTop="1px solid #d8d8d8" />
          </Fragment>
        ))}
    </>
  )
}

export default memo(ReviewSkeleton)
