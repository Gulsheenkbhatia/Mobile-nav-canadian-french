import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Flex from 'toro/components/Flex'
import Text from 'toro/components/Text'
import usePreference from 'toro/hooks/usePreference_new'
import get from 'lodash/get'
import Image from 'toro/components/Image'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import { useIntl } from 'react-intl'

export type CustomizeAndMonogramV6Props = {
  onClick: () => void
}

function CustomizeAndMonogramV6({ onClick }: CustomizeAndMonogramV6Props) {
  const styles = useStyleConfig('CustomizeAndMonogram')

  const {
    customizer: { customizerTextConfigs },
  } = usePreference({
    Customizer: ['customizerTextConfigs'],
  })

  const { formatMessage } = useIntl()

  const title = get(
    customizerTextConfigs,
    'title',
    formatMessage({
      id: 'pdp.coachCreateTitle',
      defaultMessage: 'Make it yours.',
    })
  )

  const body = get(
    customizerTextConfigs,
    'body',
    'Choose the colors, hardware, then finish it with a monogram.'
  )
  const imageSrc = get(customizerTextConfigs, 'imageSRC')

  const ctaText = get(
    customizerTextConfigs,
    'ctaText',
    formatMessage({
      id: 'pdp.product.customizeIt',
      defaultMessage: 'Customize It!',
    })
  )

  return (
    <Box sx={styles.container} data-qa="customize_it_container">
      <Flex sx={styles.card}>
        {imageSrc && (
          <Box sx={styles.imageContainer} data-qa="customize_it_mediaContainer">
            <Image src={imageSrc} sx={styles.image} />
          </Box>
        )}
        <Flex sx={styles.information}>
          <Text sx={styles.title} data-qa="customize_it_headline">
            {title}
          </Text>
          <Text sx={styles.body} data-qa="customize_it_body">
            {body}
          </Text>
          <Flex>
            <Box sx={styles.buttonContainer}>
              <Button sx={styles.button} onClick={onClick} data-qa="customize_it_cta">
                {ctaText}
              </Button>
              <Box sx={styles.buttonUnderlay} />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

export default CustomizeAndMonogramV6
