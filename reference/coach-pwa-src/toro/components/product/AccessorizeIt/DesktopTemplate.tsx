import { type FC } from 'react'
import Box from 'toro/components/Box'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import Image from 'toro/components/Image'
import StylesProvider from 'toro/components/StylesProvider'
import AccessorizeItTabs from 'toro/components/product/AccessorizeIt/AccessorizeItTabs'
import { useIntl } from 'react-intl'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

type DesktopTemplateProps = {
  accessorizeItRef?: (node: any) => void
  imageUrl: string
}

const DesktopTemplate: FC<DesktopTemplateProps> = ({ accessorizeItRef, imageUrl }) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('AccessorizeIt')

  return (
    <>
      <Box height="2px" />
      <Flex
        sx={styles.accessorizeItContainerRoot}
        ref={accessorizeItRef}
        id="accessorize-it-container"
      >
        <Box sx={styles.accessorizeItImageContainer} data-qa="img_heroImgAccessorize_It">
          <Image src={imageUrl} sx={styles.accessorizeItImage} alt="Accessorized Product Image" />
        </Box>
        <Box sx={styles.accessorizeItContainerWrapper}>
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
          <StylesProvider value={styles}>
            <AccessorizeItTabs />
          </StylesProvider>
        </Box>
      </Flex>
    </>
  )
}

export default DesktopTemplate
