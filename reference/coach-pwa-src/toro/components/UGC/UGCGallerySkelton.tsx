import React from 'react'
import Hidden from 'toro/components/Hidden'
import Skeleton from 'toro/components/Skeleton'
import Center from 'toro/components/Center'
import Box from 'toro/components/Box'
import Grid from 'toro/components/Grid'

function UGCGallerySkelton() {
  return (
    <>
      <Hidden onDesktop w="100%">
        <Box m="42px" height="100px">
          <Box>
            <Skeleton height="10px" width="100%">
              <Box mb="mar" />
            </Skeleton>
          </Box>
          <Box>
            <Skeleton height="6px" width="100%" mt="12px" mb="12px">
              <Box mb="mar" />
            </Skeleton>
          </Box>
          <Box>
            <Skeleton height="66px" width="100%">
              <Box mb="mar" />
            </Skeleton>
          </Box>
        </Box>
      </Hidden>
      <Hidden onNonDesktop w="90%" textAlign="center" mx="5%">
        <Box maxWidth="1276" m="0 auto">
          <Center width="100%">
            <Grid columnGap="mar" width="100%" templateColumns="repeat(1, 1fr)">
              <Box mt="48px" height="86px">
                <Box>
                  <Skeleton height="40px" width="100%">
                    <Box mb="mar" />
                  </Skeleton>
                </Box>
                <Box>
                  <Skeleton height="23px" width="100%" mt="22px" mb="22px">
                    <Box mb="mar" />
                  </Skeleton>
                </Box>
              </Box>
            </Grid>
          </Center>

          <Center mt="40px" mb="40px">
            <Grid columnGap="mar" width="100%" templateColumns="repeat(4, 1fr)">
              <Box>
                <Skeleton height="262px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
              <Box>
                <Skeleton height="262px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
              <Box>
                <Skeleton height="262px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
              <Box>
                <Skeleton height="262px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
            </Grid>
          </Center>
          <Center mt="40px" mb="40px">
            <Grid columnGap="mar" width="100%" templateColumns="repeat(4, 1fr)">
              <Box>
                <Skeleton height="262px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
              <Box>
                <Skeleton height="262px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
              <Box>
                <Skeleton height="262px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
              <Box>
                <Skeleton height="262px" width="100%">
                  <Box mb="mar" />
                </Skeleton>
              </Box>
            </Grid>
          </Center>
        </Box>
      </Hidden>
    </>
  )
}

export default UGCGallerySkelton
