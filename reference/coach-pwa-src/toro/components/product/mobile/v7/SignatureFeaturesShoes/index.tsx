import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { VStack } from '@chakra-ui/react'
import get from 'lodash/get'
import isObject from 'lodash/isObject'
import { useAtomValue } from 'jotai/utils'
import { sizingRangeAtom, isSizedProductAtom } from 'store/pdp.atom'
import Tabs from 'toro/components/Tabs'
import TabList from 'toro/components/TabList'
import Tab from 'toro/components/Tab'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { RunsLargeIcon, RunsSmallIcon, TrueSizeIcon } from 'toro/icons'
import useProductData from 'toro/hooks/useProductData'
import useNeutralSizingData from 'toro/hooks/useNeutralSizingData'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import Heading from 'toro/components/Heading'
import usePreference from 'toro/hooks/usePreference_new'

// TODO: Will take below icons from design system once it is added
import FitIcon from 'toro/icons/fitIcon.svg'
import CushionIcon from 'toro/icons/cushionIcon.svg'
import FlexIcon from 'toro/icons/flexIcon.svg'
import MaterialIcon from 'toro/icons/materialIcon.svg'

const INDICATOR_POSITIONS = {
  'runs-small': '16.66%',
  'true-to-size': '50%',
  'runs-large': '83.33%',
}

const TAB_CONFIG = [
  {
    id: 'fit',
    icon: FitIcon,
  },
  {
    id: 'cushion',
    icon: CushionIcon,
  },
  {
    id: 'flex',
    icon: FlexIcon,
  },
  {
    id: 'material',
    icon: MaterialIcon,
  },
]

const SignatureFeaturesShoes = () => {
  const { formatMessage } = useIntl()

  const SIZE_TEXT = {
    1: formatMessage({ id: 'pdp.product.runsSmallText', defaultMessage: 'Runs small' }),
    2: formatMessage({
      id: 'pdp.product.runsSmallText',
      defaultMessage: 'Runs small',
    }),
    3: formatMessage({ id: 'pdp.product.runsTrueToSizeText', defaultMessage: 'True to size' }),
    4: formatMessage({
      id: 'pdp.product.runsLarge',
      defaultMessage: 'Runs large',
    }),
    5: formatMessage({ id: 'pdp.product.runsLarge', defaultMessage: 'Runs large' }),
  }

  const WIDTH_TEXT = {
    1: formatMessage({ id: 'pdp.product.narrowWidth', defaultMessage: 'Narrower Width' }),
    2: formatMessage({ id: 'pdp.product.narrowWidth', defaultMessage: 'Narrower Width' }),
    3: formatMessage({ id: 'pdp.product.averageWidth', defaultMessage: 'Average Width' }),
    4: formatMessage({
      id: 'pdp.product.widerWidth',
      defaultMessage: 'Wider Width',
    }),
    5: formatMessage({
      id: 'pdp.product.widerWidth',
      defaultMessage: 'Wider Width',
    }),
  }

  const FIT_OPTIONS = [
    {
      value: 'runs-small',
      keys: [1, 2],
      label: SIZE_TEXT[1],
      sub: WIDTH_TEXT[1],
      Icon: RunsSmallIcon,
    },
    {
      value: 'true-to-size',
      keys: [3],
      label: SIZE_TEXT[3],
      sub: WIDTH_TEXT[3],
      Icon: TrueSizeIcon,
    },
    {
      value: 'runs-large',
      keys: [4, 5],
      label: SIZE_TEXT[4],
      sub: WIDTH_TEXT[4],
      Icon: RunsLargeIcon,
    },
  ]

  const styles = useMultiStyleConfig('SignatureFeaturesShoes')
  const sizingRange = useAtomValue(sizingRangeAtom)
  const [customFitSize] = useProductData(['custom.c_customFitSize'])
  const isSizedProduct = useAtomValue(isSizedProductAtom)
  const [sizes] = useSelectedColorData(['sizes', 'id'])
  const [tabIndex, setTabIndex] = useState(0)
  const {
    pdpPreferences: { templateConfigs: { pdpv7: { signatureFeaturesShoes = [] } = {} } = {} },
  } = usePreference({
    PDPPreferences: ['templateConfigs'],
  })

  const isMultiLocaleSizeExists = !!sizes?.length && isObject(get(sizes, '[0].value'))
  const { isNeutralSizingEnabled } = useNeutralSizingData()
  const customFitSizeText = customFitSize || SIZE_TEXT[sizingRange]

  const isFitSizeAvailable =
    !(isNeutralSizingEnabled && isMultiLocaleSizeExists) && customFitSizeText

  if (!isFitSizeAvailable || !isSizedProduct) return null

  const isShoeSignatureTabEnabled = (item) => item.enable !== false

  const filteredTabs = TAB_CONFIG.filter((tab) =>
    signatureFeaturesShoes?.some((item) => item.id === tab.id && isShoeSignatureTabEnabled(item))
  ).map((tab) => {
    const matched = signatureFeaturesShoes.find(
      (item) => item.id === tab.id && isShoeSignatureTabEnabled(item)
    )
    return {
      ...tab,
      label: matched?.label || '',
    }
  })

  if (!filteredTabs.length) return null

  const safeIndex = Math.min(tabIndex, filteredTabs.length - 1)

  return (
    <Box sx={styles.signatureFeatureContainer} data-qa="signature-features-shoes-container">
      <Flex sx={styles.signatureFeatureHeader} data-qa="signature-features-shoes-header">
        <Heading sx={styles.signatureFeatureHeading}>
          {formatMessage({
            id: 'pdp.product.signatureFeatureHeading',
            defaultMessage: 'Signature Features',
          })}
        </Heading>
        {isFitSizeAvailable && (
          <VStack>
            <Text as="p" sx={styles.signatureFeatureSubHeading}>
              {formatMessage(
                {
                  id: 'pdp.product.signatureFeatureContent',
                  defaultMessage: 'Customers say this {customFitSizeText},',
                },
                { customFitSizeText: customFitSizeText.toLowerCase() }
              )}
              <br />
              {formatMessage({
                id: 'pdp.product.signatureFeatureContentSub',
                defaultMessage: ' with a comfortably relaxed fit.',
              })}
            </Text>

            <Text as="span" sx={styles.signatureFeatureExtraHeading}>
              {formatMessage({
                id: 'pdp.product.signatureFeatureSubheading',
                defaultMessage: 'Based on previous orders and ',
              })}

              <Box as="a" href="#reviews" sx={styles.reviewsLink}>
                {formatMessage({
                  id: 'pdp.product.signatureFeaturesReviews',
                  defaultMessage: 'reviews',
                })}
              </Box>
            </Text>
          </VStack>
        )}
      </Flex>

      {isFitSizeAvailable && (
        <Box sx={styles.signatureFeatureFitContainer} data-qa="signature-features-fit-container">
          <Box>
            <Flex sx={styles.signatureFeatureIconWrapper}>
              {FIT_OPTIONS.map((option) => {
                const isActive = option.keys.includes(sizingRange)
                const Icon = option.Icon

                return (
                  <Flex
                    key={option.value}
                    sx={{
                      ...styles.signatureFeatureIconItem,
                      ...(isActive
                        ? styles.signatureFeatureIconActive
                        : styles.signatureFeatureIconInactive),
                    }}
                  >
                    <Box sx={styles.signatureFeatureIconBox}>
                      <Icon
                        style={{
                          ...styles.signatureFeatureIconSvg,
                          ...(isActive
                            ? styles.signatureFeatureIconSvgActive
                            : styles.signatureFeatureIconSvgInactive),
                        }}
                      />
                    </Box>

                    <Text
                      sx={{
                        ...styles.signatureFeatureLabel,
                        ...(isActive
                          ? styles.signatureFeatureLabelActive
                          : styles.signatureFeatureLabelInactive),
                      }}
                    >
                      {SIZE_TEXT[option.keys[0]]}
                    </Text>

                    <Text sx={styles.signatureFeatureSubLabel}>{option.sub}</Text>
                  </Flex>
                )
              })}
            </Flex>

            <Box sx={styles.signatureFeatureIndicatorWrapper}>
              <Box sx={styles.signatureFeatureIndicatorLineWrapper}>
                <Box sx={styles.signatureFeatureIndicatorLine} />
                <Box sx={styles.signatureFeatureIndicatorLineGradientLeft} />
                <Box sx={styles.signatureFeatureIndicatorLineGradientRight} />
              </Box>

              <Box aria-hidden sx={styles.signatureFeatureIndicatorDots}>
                {FIT_OPTIONS.map((option) => {
                  const isActive = option.keys.includes(sizingRange)
                  const left = INDICATOR_POSITIONS[option.value] || '50%'

                  return (
                    <Box
                      key={option.value}
                      sx={{
                        ...styles.signatureFeatureIndicatorDot,
                        left,
                        bg: isActive ? 'black' : 'white',
                      }}
                    />
                  )
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      {filteredTabs.length > 1 && (
        <Box sx={styles.signatureFeaturesFooter} data-qa="signature-features-shoes-footer">
          <Text sx={styles.helperText}>
            {formatMessage({
              id: 'pdp.product.signatureFeaturesTap',
              defaultMessage: 'Tap and discover',
            })}
          </Text>

          <Tabs index={safeIndex} onChange={setTabIndex}>
            <TabList sx={styles.tabList}>
              {filteredTabs.map((tab, index) => {
                const Icon = tab.icon
                const isActive = index === safeIndex
                return (
                  <Tab
                    key={tab.id}
                    sx={{
                      ...styles.Tab,
                      ...(isActive ? styles.ActiveTab : {}),
                    }}
                    data-qa={`signature-features-tab-${tab.id}`}
                    aria-selected={isActive}
                  >
                    <Icon />
                    <Text sx={styles.label}>
                      {formatMessage({
                        id: `signatureFeatures.${tab.id}.label`,
                        defaultMessage: tab.label,
                      })}
                    </Text>
                  </Tab>
                )
              })}
            </TabList>
          </Tabs>
        </Box>
      )}
    </Box>
  )
}

export default SignatureFeaturesShoes
