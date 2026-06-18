import React, { memo } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Skeleton from 'toro/components/Skeleton'
import Grid from 'toro/components/Grid'
import Hidden from 'toro/components/Hidden'
import { Spacer } from '@chakra-ui/layout'
import Text from 'toro/components/Text'
import useViewportType from 'toro/hooks/useViewportType'
import Center from 'toro/components/Center'

function ProductDetailSkeleton() {
  const { isDesktop } = useViewportType()
  const bgColor = 'var(--neutrals-color-neutral-light)'
  const renderSameSlots = []
  for (let i = 0; i < 3; i++) {
    renderSameSlots.push(
      <Flex>
        <Box w="35%" ml={isDesktop ? '-8px' : '12px'}>
          <Skeleton height="19px" margin="24px 9px 5px" bg={bgColor} />
        </Box>
        <Spacer />
        <Box w="52%">
          <Skeleton height="16px" margin="26px 12px 6px 0" bg={bgColor} />
          <Skeleton height="16px" margin="5px 12px 6px 0" bg={bgColor} />
          <Skeleton height="16px" margin="6px 12px 6px 0" bg={bgColor} />
          <Skeleton height="16px" margin="6px 12px 48px 0" bg={bgColor} />
        </Box>
      </Flex>
    )
  }
  const renderContentAreaOnDesktop = () => (
    <Center mr="10%" mt="40px" mb="40px" ml="10%">
      <Grid columnGap="mar" width="100%" templateColumns="repeat(2, 1fr)">
        <Box>
          <Skeleton height="462px" width="100%">
            <Box mb="mar" />
          </Skeleton>
        </Box>
        <Box>
          <Skeleton
            height="32px"
            width="calc(100% - 64px)"
            mr="32px"
            ml="32px"
            mt="200px"
            mb="40px"
          >
            <Box mb="mar" />
          </Skeleton>
          <Skeleton height="72px" width="100%">
            <Box mb="mar" />
          </Skeleton>
        </Box>
      </Grid>
    </Center>
  )

  const renderContentAreaOnMobile = () => (
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
          <Skeleton width="11%" height="16px" margin="15px 22px 8px 12px" bg={bgColor} />
          <Skeleton width="15%" height="16px" margin="15px 20px 8px 1px" bg={bgColor} />
          <Skeleton width="42%" height="16px" margin="15px 32px 8px 9px" bg={bgColor} />
        </Flex>
        <Skeleton width="80%" height="24px" margin="8px 29px 8px 12px" bg={bgColor} />
        <Flex>
          <Skeleton width="33%" height="16px" margin="8px 16px 16px 12px" bg={bgColor} />
          <Spacer />
          <Skeleton width="33%" height="16px" margin="8px 16px 16px 12px" bg={bgColor} />
        </Flex>
        <Skeleton width="100%" height="469px" margin="16px 0" bg={bgColor} />
        <Skeleton width="17%" height="34px" margin="16px 1px 8px 12px" bg={bgColor} />
        <Skeleton width="85%" height="17px" margin="8px 11px 16px 12px" bg={bgColor} />
        <Skeleton width="61%" height="17px" margin="16px 4px 24px 12px" bg={bgColor} />
        <Flex>
          <Skeleton width="33%" height="20px" margin="24px 16px 8px 12px" bg={bgColor} />
          <Skeleton width="33%" height="20px" margin="24px 12px 8px 10px" bg={bgColor} />
        </Flex>
        <Flex>
          <Skeleton width="21%" height="95px" margin="8px 4px 24px 12px" bg={bgColor} />
          <Skeleton width="21%" height="95px" margin="8px 4px 24px" bg={bgColor} />
          <Skeleton width="21%" height="95px" margin="8px 4px 24px" bg={bgColor} />
          <Skeleton width="21%" height="95px" margin="8px 4px 24px" bg={bgColor} />
          <Skeleton width="7%" height="95px" margin="8px 0 24px 4px" bg={bgColor} />
        </Flex>
        <Skeleton width="94%" height="48px" margin="24px 12px 12px" bg={bgColor} />
        <Flex>
          <Skeleton width="45%" height="48px" margin="12px 12px 25px" bg={bgColor} />
          <Skeleton width="45%px" height="48px" margin="12px 12px 25px" bg={bgColor} />
        </Flex>
        <Skeleton width="85%" height="17px" margin="25px 11px 8px 12px" bg={bgColor} />
        <Skeleton width="85%px" height="19px" margin="8px 11px 42px 12px" bg={bgColor} />
        <Skeleton width="94%" height="19px" margin="42px 12px 36px" bg={bgColor} />
        <Skeleton width="94%" height="19px" margin="36px 12px 24px" bg={bgColor} />
        {renderSameSlots}
        <Skeleton width="60%" height="20px" margin="27px 0 40px 12px" bg={bgColor} />
        <Skeleton width="94%" height="19px" margin="40px 12px 38px" bg={bgColor} />
        <Flex>
          <Box w="100%">
            <Skeleton width="156px" height="20px" margin="38px 0 41px 12px" bg={bgColor} />
          </Box>
          <Box w="100%">
            <Flex>
              <Skeleton width="20px" height="20px" margin="38px 20px 41px 16px" bg={bgColor} />
              <Skeleton width="20px" height="20px" margin="38px 28px 41px 4px" bg={bgColor} />
              <Skeleton width="20px" height="20px" margin="38px 28px 41px 4px" bg={bgColor} />
              <Skeleton width="20px" height="20px" margin="38px 13px 41px 11px" bg={bgColor} />
            </Flex>
          </Box>
        </Flex>
        <hr />
        <Box>{renderContentAreaOnMobile()}</Box>
        <hr />
        <Box>{renderContentAreaOnMobile()}</Box>
        <hr />
      </Hidden>
      {isDesktop && (
        <Hidden onNonDesktop>
          <Box maxW="1440px" m={'auto'}>
            <Box mt="21px">
              <Flex>
                <Skeleton w="3%" h="19px" bg={bgColor} />
                <Skeleton w="4%" h="19px" ml="5px" bg={bgColor} />
                <Skeleton w="12%" h="19px" ml="5px" bg={bgColor} />
              </Flex>
            </Box>
            <Flex>
              <Box mt="130px" w="7%">
                <Skeleton h="108px" ml="5px" w="86px" mb="16px" bg={bgColor} />
                <Skeleton h="108px" ml="5px" w="88px" mb="16px" bg={bgColor} />
                <Skeleton h="108px" ml="5px" w="88px" mb="16px" bg={bgColor} />
              </Box>
              <Box ml="3.1%" mt="20px" w="57%">
                <Skeleton h="527px" w="100%" bg={bgColor} />
              </Box>
              <Box mt="20px" ml="1.7%" w="30%">
                <Skeleton h="28px" mb="16px" bg={bgColor} />
                <Skeleton h="20px" mb="19px" bg={bgColor} />
                <Skeleton h="36px" w="88px" m="19px 67px 8px 0" bg={bgColor} />
                <Skeleton h="16px" w="336px" m="8px 8px 21px 0" bg={bgColor} />
                <Skeleton h="16px" w="235px" m="21px 23px 24px 0" bg={bgColor} />
                <Box mt="24px">
                  <Flex>
                    <Skeleton h="19px" w="112px" m="0px 43px 13px 0" bg={bgColor} />
                    <Spacer />
                    <Skeleton h="19px" w="127px" m="0px 0px 13px 25px" bg={bgColor} />
                  </Flex>
                </Box>
                <Flex>
                  <Skeleton h="95px" w="80px" m="10px 3px 24px 0px" bg={bgColor} />
                  <Skeleton h="95px" w="80px" m="10px 3px 24px" bg={bgColor} />
                  <Skeleton h="95px" w="80px" m="10px 3px 24px" bg={bgColor} />
                  <Skeleton h="95px" w="80px" m="10px 3px 24px" bg={bgColor} />
                  <Skeleton h="95px" w="80px" m="10px 2px 24px 2px" bg={bgColor} />
                </Flex>
                <Skeleton h="48px" w="400px" m="0px 0px 12px" bg={bgColor} />
                <Skeleton h="48px" w="400px" m="12px 0px 12px" bg={bgColor} />
                <Skeleton h="16px" w="396px" m="25px 6px 10px 0px" bg={bgColor} />
                <Skeleton h="16px" w="88px" m="10px 67px 45px 0px" bg={bgColor} />
                <Skeleton h="20px" w="400px" m="45px 0px 39px" bg={bgColor} />
                <Skeleton h="20px" w="400px" m="39px 0px 19px" bg={bgColor} />
                <Box mt="-20px">
                  <Flex>
                    <Box w="35%" ml={'-10px'}>
                      <Skeleton height="19px" margin="24px 9px 5px" bg={bgColor} />
                    </Box>
                    <Spacer />
                    <Box w="52%">
                      <Skeleton height="16px" w="157px" margin="26px 12px 6px -33px" bg={bgColor} />
                      <Skeleton height="16px" w="157px" margin="5px 12px 6px -33px" bg={bgColor} />
                      <Skeleton height="16px" w="157px" margin="6px 12px 6px -33px" bg={bgColor} />
                      <Skeleton height="16px" w="157px" margin="6px 12px 48px -33px" bg={bgColor} />
                    </Box>
                  </Flex>
                </Box>
                <Box mt="-20px">
                  <Flex>
                    <Box w="35%" ml={'-10px'}>
                      <Skeleton height="19px" margin="24px 9px 5px" bg={bgColor} />
                    </Box>
                    <Spacer />
                    <Box w="52%">
                      <Skeleton height="16px" w="157px" margin="23px 12px 6px -33px" bg={bgColor} />
                      <Skeleton height="16px" w="157px" margin="5px 12px 6px -33px" bg={bgColor} />
                      <Skeleton height="16px" w="157px" margin="6px 12px 6px -33px" bg={bgColor} />
                      <Skeleton height="16px" w="157px" margin="6px 12px 48px -33px" bg={bgColor} />
                    </Box>
                  </Flex>
                </Box>
                <Box mt="-20px">
                  <Flex>
                    <Box w="35%" ml={'-10px'}>
                      <Skeleton height="19px" margin="24px 9px 5px" bg={bgColor} />
                    </Box>
                    <Spacer />
                    <Box w="52%">
                      <Skeleton height="16px" w="157px" margin="23px 12px 6px -33px" bg={bgColor} />
                      <Skeleton height="16px" w="157px" margin="5px 12px 6px -33px" bg={bgColor} />
                      <Skeleton height="16px" w="157px" margin="6px 12px 6px -33px" bg={bgColor} />
                      <Skeleton height="16px" w="157px" margin="6px 12px 48px -33px" bg={bgColor} />
                    </Box>
                  </Flex>
                </Box>
                <Skeleton h="20px" w="226px" m="-15px 32px 41px 0px" bg={bgColor} />
                <Skeleton h="20px" w="400px" m="41px 0px 37px" bg={bgColor} />
                <Box mt="-37px">
                  <Flex>
                    <Box w="100%">
                      <Skeleton width="156px" height="20px" margin="38px 0 41px 0px" bg={bgColor} />
                    </Box>
                    <Box w="100%">
                      <Flex>
                        <Skeleton
                          width="20px"
                          height="20px"
                          margin="38px 20px 41px 16px"
                          bg={bgColor}
                        />
                        <Skeleton
                          width="20px"
                          height="20px"
                          margin="38px 28px 41px 4px"
                          bg={bgColor}
                        />
                        <Skeleton
                          width="20px"
                          height="20px"
                          margin="38px 28px 41px 4px"
                          bg={bgColor}
                        />
                        <Skeleton
                          width="20px"
                          height="20px"
                          margin="38px 13px 41px 11px"
                          bg={bgColor}
                        />
                      </Flex>
                    </Box>
                  </Flex>
                </Box>
                <Skeleton
                  h="176px"
                  w="400px"
                  m="24px 69px 22px 0px"
                  bg={bgColor}
                  sx={{ display: 'grid', placeItems: 'center' }}
                >
                  <Skeleton
                    h="21px"
                    w="248px"
                    bg="var(--color-inactive) !important"
                    visibility="unset"
                  />
                  <Skeleton
                    h="16px"
                    w="288px"
                    bg="var(--color-inactive) !important"
                    visibility="unset"
                  />
                  <Skeleton
                    h="16px"
                    w="288px"
                    bg="var(--color-inactive) !important"
                    visibility="unset"
                  />
                  <Skeleton
                    h="16px"
                    w="288px"
                    bg="var(--color-inactive) !important"
                    visibility="unset"
                  />
                  <Skeleton
                    h="21px"
                    w="101px"
                    m="11px 94px 0px"
                    bg="var(--color-inactive) !important"
                    visibility="unset"
                  />
                </Skeleton>
              </Box>
            </Flex>
            <hr />
            <Box>{renderContentAreaOnDesktop()}</Box>
            <hr />
            <Box>{renderContentAreaOnDesktop()}</Box>
            <hr />
            <Box
              h="477px"
              grow="0"
              direction="column"
              justify="center"
              align="center"
              p="48px 0 0"
              bg="var(--no-fill)"
              mb="40px"
              fontFamily="HelveticaLTPro"
              fontSize="30px"
              fontWeight="bold"
              lineHeight="1.5"
              letterSpacing="0.2px"
              textAlign="center"
              color="var(--color-black-base)"
            >
              <Text
                w="265px"
                h="34px"
                grow="0"
                mb="40px"
                fontFamily="HelveticaLTPro"
                fontSize="30px"
                fontWeight="bold"
                lineHeight="1.5"
                letterSpacing="0.2px"
                textAlign="center"
                color="var(--color-black)"
              >
                You May Also Like
              </Text>
              <Flex justify="center">
                <Skeleton ml="5px" w="216px" h="270px" grow="0" bg={bgColor} />
                <Skeleton ml="5px" w="216px" h="270px" grow="0" bg={bgColor} />
                <Skeleton ml="5px" w="216px" h="270px" grow="0" bg={bgColor} />
                <Skeleton ml="5px" w="216px" h="270px" grow="0" bg={bgColor} />
              </Flex>
            </Box>
            <hr />
            <Box>{renderContentAreaOnDesktop()}</Box>
            <hr />
            <Box
              h="477px"
              grow="0"
              direction="column"
              justify="center"
              align="center"
              p="48px 0 0"
              bg="var(--no-fill)"
            >
              <Text
                w="265px"
                h="34px"
                grow="0"
                mb="40px"
                fontFamily="HelveticaLTPro"
                fontSize="30px"
                fontWeight="bold"
                lineHeight="1.5"
                letterSpacing="0.2px"
                textAlign="center"
                color="var(--color-black)"
              >
                Recently Viewed
              </Text>
              <Flex justify="center">
                <Skeleton ml="5px" w="216px" h="270px" grow="0" bg={bgColor} />
                <Skeleton ml="5px" w="216px" h="270px" grow="0" bg={bgColor} />
                <Skeleton ml="5px" w="216px" h="270px" grow="0" bg={bgColor} />
                <Skeleton ml="5px" w="216px" h="270px" grow="0" bg={bgColor} />
              </Flex>
            </Box>
          </Box>
        </Hidden>
      )}
    </>
  )
}

export default memo(ProductDetailSkeleton)
