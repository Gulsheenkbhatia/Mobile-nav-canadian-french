import { type FC } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Image from 'toro/components/Image'
import StylesProvider from 'toro/components/StylesProvider'
import AccessorizeItTabs from 'toro/components/product/AccessorizeIt/AccessorizeItTabs'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import AssessorizeItTopLeft from 'components/assets/assessorize-it-top-left.png'
import AssessorizeItBottomRight from 'components/assets/assessorize-it-bottom-right.png'

type MobileTemplateProps = {
  accessorizeItRef?: (node: any) => void
  imageUrl: string
  isPdpV6?: boolean
}

const MobileTemplate: FC<MobileTemplateProps> = ({ accessorizeItRef, imageUrl, isPdpV6 }) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('AccessorizeIt')

  return (
    <>
      <Box height="2px" />
      <Box sx={styles.accessorizeItContainerRoot} ref={accessorizeItRef}>
        {!isPdpV6 && (
          <Image
            src={AssessorizeItTopLeft}
            alt="Accessorize It Top Left"
            containerProps={styles.accessorizeItTopLeftImageContainer}
          />
        )}
        <Box sx={styles.accessorizeItContainerWrapper} id="accessorize-it-container">
          <Flex flexDirection="column" alignItems="center">
            <Text sx={styles.accessorizeItTitle} data-qa="label_titleAccessorize_It">
              {formatMessage({
                id: 'pdp.coachCreateTitle',
                defaultMessage: 'Make it Yours.',
              })}
            </Text>
            <Text sx={styles.accessorizeItSubtitle} data-qa="label_subtitleAccessorize_It">
              {formatMessage({
                id: 'pdp.coachCreateBody',
                defaultMessage: 'Personalize your bag with straps and charms',
              })}
            </Text>
            <Box sx={styles.accessorizeItImageContainer} data-qa="img_heroImgAccessorize_It">
              <Image
                src={imageUrl}
                sx={styles.accessorizeItImage}
                alt="Accessorized Product Image"
              />
            </Box>
          </Flex>
          <StylesProvider value={styles}>
            <AccessorizeItTabs />
          </StylesProvider>
        </Box>
        {!isPdpV6 && (
          <Image
            src={AssessorizeItBottomRight}
            alt="Accessorize It Bottom Right"
            containerProps={styles.accessorizeItBottomRightImageContainer}
          />
        )}
      </Box>
    </>
  )
}

export default MobileTemplate
