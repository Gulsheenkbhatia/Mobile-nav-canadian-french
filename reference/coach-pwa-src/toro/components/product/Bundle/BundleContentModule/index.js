import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Box from 'toro/components/Box'
import Image from 'toro/components/Image'
import Link from 'toro/components/Link'
import useTheme from 'toro/hooks/useTheme'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import ConditionalWrapper from 'toro/components/ConditionalWrapper'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import useViewportType from 'toro/hooks/useViewportType'
import useExperiment from 'toro/hooks/useExperiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { NavChevronRightBoldIcon } from 'toro/icons'

function BundleContentModule({ bundleLinkText, bundleMessage, bundleImg, bundleUrl }) {
  const { isMobile } = useViewportType()
  const isPdpV42Enabled = useExperiment(EXPERIMENTS.PDP_V4_2) && isMobile
  const styles = useMultiStyleConfig('BundleContentModule', {
    variant: isPdpV42Enabled ? 'pdpv42' : undefined,
  })
  const { fontSizes, fontFamily, lineHeights } = useTheme()

  const textProps = {
    as: 'span',
    fontSize: fontSizes.md,
    fontWeight: fontFamily.primaryNormal,
    lineHeight: lineHeights.md,
  }

  return (
    <ConditionalWrapper
      Wrapper={Link}
      condition={isPdpV42Enabled}
      href={bundleUrl}
      data-qa="part_of_bundle_cta"
    >
      <Box sx={styles.bundleModuleWrapper}>
        <Flex align="center">
          <Flex gridGap="10px" align="center" flex={1}>
            <Image
              sx={styles.bundleImage}
              src={bundleImg?.absURL}
              h="50px"
              w="40px"
              objectFit="cover"
            />
            <Text {...textProps}>{bundleMessage}</Text>
          </Flex>
          <Link href={bundleUrl} textDecoration={'underline'} lineHeight={0}>
            {isPdpV42Enabled ? (
              <NavChevronRightBoldIcon height="18px" width="18px" />
            ) : (
              <Text {...textProps} fontSize={fontSizes.sm}>
                {bundleLinkText}
              </Text>
            )}
          </Link>
        </Flex>
      </Box>
    </ConditionalWrapper>
  )
}

BundleContentModule.propTypes = {
  bundleLinkText: PropTypes.string,
  bundleMessage: PropTypes.string,
  bundleImg: PropTypes.object,
  bundleUrl: PropTypes.string,
}

export default withErrorBoundaryWrapper(BundleContentModule)
