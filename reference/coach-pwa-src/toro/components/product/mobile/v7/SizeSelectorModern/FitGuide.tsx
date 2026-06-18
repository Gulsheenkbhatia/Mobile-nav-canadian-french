import { useIntl } from 'react-intl'
import { Table, Thead, Tbody, Tr, Th, Td, Collapse, VStack, TableContainer } from '@chakra-ui/react'
import DrawerBody from 'toro/components/DrawerBody'
import Grid from 'toro/components/Grid'
import GridItem from 'toro/components/GridItem'
import Input from 'toro/components/Input'
import Heading from 'toro/components/Heading'
import useDisclosure from 'toro/hooks/useDisclosure'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import Button from 'toro/components/Button'
import Box from 'toro/components/Box'
import dynamic from 'next/dynamic'

import {
  NavChevronUpIcon,
  NavChevronDownIcon,
  RunsLargeIcon,
  RunsSmallIcon,
  TrueSizeIcon,
} from 'toro/icons'
import { useState, useMemo, useEffect, ChangeEvent } from 'react'
import isObject from 'lodash/isObject'
import { setFitReviewAtom, sizingRangeAtom, recommendedFitGuideSizeAtom } from 'store/pdp.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useSelectedColorData from 'toro/hooks/useSelectedColorData'
import useProductData from 'toro/hooks/useProductData'
import useNeutralSizingData from 'toro/hooks/useNeutralSizingData'
import get from 'lodash/get'
import useStyles from 'toro/hooks/useStyles'
import {
  FOOT_LENGTH_INPUT_REGEX_CM,
  FOOT_LENGTH_INPUT_REGEX_IN,
  FIT_GUIDE_MSG_FOOT_LENGTH_RANGE_CM,
  FIT_GUIDE_MSG_FOOT_LENGTH_RANGE_INCHES,
  FOOT_LENGTH_RECOMMENDED_SIZE_DEBOUNCE_MS,
} from 'toro/constants/fitGuideRegExp'
import usePreference from 'toro/hooks/usePreference_new'
import useDebounce from 'toro/helpers/useDebounce'
import {
  CM_PER_INCH,
  enrichAndSortSizeDataByFootLength,
  getFootLengthBoundsFromTable,
  getFootLengthValidationStatus,
  type FitGuideSizeRow,
} from 'toro/helpers/fitGuideSizeData'

const inchesToCm = (inches: number) => inches * CM_PER_INCH
const cmToInches = (cm: number) => cm / CM_PER_INCH
const HtmlContent = dynamic(() => import('toro/components/HtmlContent'))

const FitGuide = ({ draftSize }) => {
  const styles = useStyles()
  const [footLength, setFootLength] = useState('')
  const [unit, setUnit] = useState<'IN' | 'CM'>('IN')
  const { isOpen, onToggle } = useDisclosure()
  const [sizes] = useSelectedColorData(['sizes', 'id'])
  const { formatMessage } = useIntl()
  const [customFitSize, footMeasureMarkup, footMeasureOnline] = useProductData([
    'custom.c_customFitSize',
    'footMeasureContent.c_body.default.markup',
    'footMeasureContent.online.default',
  ])
  const setFitReview = useUpdateAtom(setFitReviewAtom)
  const sizingRange = useAtomValue(sizingRangeAtom)
  const setRecommendedFitGuideSize = useUpdateAtom(recommendedFitGuideSizeAtom)
  const debouncedFootLength = useDebounce(footLength, FOOT_LENGTH_RECOMMENDED_SIZE_DEBOUNCE_MS)
  const {
    pdpPreferences: { templateConfigs: { pdpv7: { sizeData = [] } = {} } = {} },
  } = usePreference({
    PDPPreferences: ['templateConfigs'],
  })

  const runsSmallText = formatMessage({
    id: 'pdp.product.runsSmallText',
    defaultMessage: 'Runs small',
  })
  const runsTrueToSizeText = formatMessage({
    id: 'pdp.product.runsTrueToSizeText',
    defaultMessage: 'True to size',
  })
  const runsLargeText = formatMessage({
    id: 'pdp.product.runsLarge',
    defaultMessage: 'Runs large',
  })
  const SIZE_TEXT = {
    1: runsSmallText,
    2: runsSmallText,
    3: runsTrueToSizeText,
    4: runsLargeText,
    5: runsLargeText,
  }

  const FIT_OPTIONS = [
    {
      value: 'runs-small',
      keys: [1, 2],
      label: SIZE_TEXT[1],
      Icon: RunsSmallIcon,
    },
    {
      value: 'true-to-size',
      keys: [3],
      label: SIZE_TEXT[3],
      Icon: TrueSizeIcon,
    },
    {
      value: 'runs-large',
      keys: [4, 5],
      label: SIZE_TEXT[4],
      Icon: RunsLargeIcon,
    },
  ]

  const isMultiLocaleSizeExists = !!sizes?.length && isObject(get(sizes, '[0].value'))
  const { isNeutralSizingEnabled } = useNeutralSizingData()
  const customFixSizeText = customFitSize || SIZE_TEXT[sizingRange]

  const isFitSizeAvailable =
    !(isNeutralSizingEnabled && isMultiLocaleSizeExists) && customFixSizeText

  const footLengthBounds = useMemo(() => getFootLengthBoundsFromTable(sizeData), [sizeData])

  const footLengthValidation = useMemo(
    () => getFootLengthValidationStatus(footLength, unit, footLengthBounds),
    [footLength, unit, footLengthBounds]
  )

  const debouncedFootLengthValidation = useMemo(() => {
    if (debouncedFootLength === footLength) return footLengthValidation
    return getFootLengthValidationStatus(debouncedFootLength, unit, footLengthBounds)
  }, [debouncedFootLength, footLength, footLengthValidation, unit, footLengthBounds])

  const footLengthRangeError =
    footLengthValidation.kind === 'invalid_range'
      ? formatMessage(
          footLengthValidation.unit === 'IN'
            ? FIT_GUIDE_MSG_FOOT_LENGTH_RANGE_INCHES
            : FIT_GUIDE_MSG_FOOT_LENGTH_RANGE_CM,
          {
            min: footLengthValidation.minDisplay,
            max: footLengthValidation.maxDisplay,
          }
        )
      : null

  useEffect(() => {
    setFitReview({ ['size']: customFixSizeText })
  }, [customFixSizeText, draftSize])

  const shouldHighlightClosestSizeRow = footLengthValidation.kind === 'valid'

  const footLengthOppositeUnit = useMemo(() => {
    const trimmed = footLength.trim()
    if (!trimmed || trimmed.endsWith('.')) return null
    const numValue = parseFloat(trimmed)
    if (isNaN(numValue)) return null
    return unit === 'IN' ? inchesToCm(numValue) : cmToInches(numValue)
  }, [footLength, unit])

  const filteredAndSortedSizeData = useMemo(() => {
    if (footLengthValidation.kind !== 'valid') return sizeData
    return enrichAndSortSizeDataByFootLength(sizeData, footLength, unit)
  }, [footLength, unit, sizeData, footLengthValidation.kind])

  const sortedSizeDataForDebouncedInput = useMemo(() => {
    if (debouncedFootLengthValidation.kind !== 'valid') return sizeData
    return enrichAndSortSizeDataByFootLength(sizeData, debouncedFootLength, unit)
  }, [sizeData, debouncedFootLength, unit, debouncedFootLengthValidation.kind])

  useEffect(() => {
    if (debouncedFootLengthValidation.kind === 'valid') {
      setRecommendedFitGuideSize(sortedSizeDataForDebouncedInput[0]?.us ?? '')
      return
    }
  }, [
    debouncedFootLength,
    debouncedFootLengthValidation.kind,
    sortedSizeDataForDebouncedInput,
    setRecommendedFitGuideSize,
  ])

  const getCurrentLength = (row: FitGuideSizeRow) =>
    unit === 'IN' ? row.length.toString() : inchesToCm(row.length).toFixed(1)

  const handleUnitChange = (newUnit: 'IN' | 'CM') => {
    if (newUnit === unit) return
    if (footLength && footLengthOppositeUnit != null) {
      setFootLength(footLengthOppositeUnit.toFixed(1))
    }
    setUnit(newUnit)
  }
  const handleFootLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    const pattern = unit === 'IN' ? FOOT_LENGTH_INPUT_REGEX_IN : FOOT_LENGTH_INPUT_REGEX_CM
    if (val === '' || pattern.test(val)) {
      setFootLength(val)
    }
  }
  return (
    <DrawerBody sx={styles.fitGuideDrawerBody}>
      <Box>
        <Box sx={styles.fitGuideContainer}>
          <Flex flexDirection="column" align="center" justify="center" textAlign="center" gap={3}>
            <Heading sx={styles.fitGuideHeading}>
              {formatMessage({ id: 'pdp.product.fitGuide', defaultMessage: 'Fit Guide' })}
            </Heading>
            {isFitSizeAvailable && (
              <VStack>
                <Text sx={styles.fitGuideContent}>
                  {formatMessage(
                    {
                      id: 'pdp.product.fitGuideContent',
                      defaultMessage: 'Customers say this <strong>{customFixSizeText}</strong>,',
                    },
                    {
                      customFixSizeText: customFixSizeText.toLowerCase(),
                      strong: (chunks) => <strong style={{ fontWeight: 500 }}>{chunks}</strong>,
                    }
                  )}
                  <br />
                  {formatMessage({
                    id: 'pdp.product.fitGuideContentSub',
                    defaultMessage: ' with a comfortably relaxed fit.',
                  })}
                </Text>
                <Text sx={styles.fitGuideReviewText}>
                  {formatMessage({
                    id: 'pdp.product.fitGuideSubheading',
                    defaultMessage: 'Based on previous orders and reviews',
                  })}
                </Text>
              </VStack>
            )}
          </Flex>
          {isFitSizeAvailable && (
            <Box sx={styles.fitGuideIconsSection}>
              <Grid sx={styles.fitGuideIconGrid}>
                {FIT_OPTIONS.map((option) => {
                  const isActive = option.keys.includes(sizingRange)
                  const Icon = option.Icon

                  return (
                    <GridItem key={option.value}>
                      <Flex
                        sx={{
                          ...styles.fitGuideIconItem,
                          ...(isActive ? styles.fitGuideIconActive : styles.fitGuideIconInactive),
                        }}
                      >
                        <Box sx={styles.fitGuideIconBox}>
                          <Icon
                            style={{
                              ...styles.fitGuideIconSvg,
                              ...(isActive
                                ? styles.fitGuideIconSvgActive
                                : styles.fitGuideIconSvgInactive),
                            }}
                          />
                        </Box>

                        <Text
                          sx={{
                            ...styles.fitGuideLabel,
                            ...(isActive
                              ? styles.fitGuideLabelActive
                              : styles.fitGuideLabelInactive),
                          }}
                        >
                          {SIZE_TEXT[option.keys[0]]}
                        </Text>
                      </Flex>
                    </GridItem>
                  )
                })}
              </Grid>

              <Box sx={styles.fitGuideIndicatorWrapper}>
                <Box sx={styles.fitGuideIndicatorLineWrapper}>
                  <Box sx={styles.fitGuideIndicatorLine} />
                  <Box sx={styles.fitGuideIndicatorLineGradientLeft} />
                  <Box sx={styles.fitGuideIndicatorLineGradientRight} />
                </Box>

                <Grid aria-hidden sx={styles.fitGuideIndicatorDotsGrid}>
                  {FIT_OPTIONS.map((option) => {
                    const isActive = option.keys.includes(sizingRange)

                    return (
                      <GridItem key={option.value} sx={styles.fitGuideIndicatorDotsGridItem}>
                        <Box
                          sx={{
                            ...styles.fitGuideIndicatorDot,
                            bg: isActive ? 'black' : 'white',
                          }}
                        />
                      </GridItem>
                    )
                  })}
                </Grid>
              </Box>
            </Box>
          )}

          <Box sx={styles.fitGuideFootLengthContainer}>
            <Text sx={styles.fitGuideFootLengthText}>
              {formatMessage({
                id: 'pdp.product.footLength',
                defaultMessage: 'Foot Length',
              })}
            </Text>
            <Flex sx={styles.fitGuideInputGroup}>
              <Input
                flex={1}
                minW={0}
                placeholder={unit === 'IN' ? 'e.g. 9.5' : 'e.g. 24.1'}
                value={footLength}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                onChange={handleFootLengthChange}
                isInvalid={footLengthValidation.kind === 'invalid_range'}
                sx={styles.fitGuideInputBox}
              />

              <Flex sx={styles.fitGuideUnitToggleWrapper}>
                <Button
                  variant="unstyled"
                  onClick={() => handleUnitChange('IN')}
                  sx={unit === 'IN' ? styles.unitActive : styles.unitInActive}
                >
                  {formatMessage({
                    id: 'pdp.product.in',
                    defaultMessage: 'IN',
                  })}
                </Button>
                <Button
                  variant="unstyled"
                  onClick={() => handleUnitChange('CM')}
                  sx={unit === 'CM' ? styles.unitActive : styles.unitInActive}
                >
                  {formatMessage({
                    id: 'pdp.product.cm',
                    defaultMessage: 'CM',
                  })}
                </Button>
              </Flex>
            </Flex>
            {footLengthRangeError && (
              <Text role="alert" sx={styles.fitGuideInputError} variant="body-primary" size="sm">
                {footLengthRangeError}
              </Text>
            )}

            <Box sx={styles.fitGuideAccordionContainer}>
              <Button
                variant="unstyled"
                onClick={onToggle}
                aria-expanded={isOpen}
                aria-controls="how-to-measure-content"
                sx={{
                  ...styles.fitGuideAccordionHeader,
                  ...styles.fitGuideAccordionButton,
                }}
              >
                <Text sx={{ ...styles.fitGuideAccordionText, flex: 1 }}>
                  {formatMessage({
                    id: 'pdp.product.howToMeasureFoot',
                    defaultMessage: 'How to measure your foot length',
                  })}
                </Text>
                <Box sx={styles.fitGuideAccordionIconContainer}>
                  {isOpen ? (
                    <NavChevronUpIcon width="24px" height="24px" />
                  ) : (
                    <NavChevronDownIcon width="24px" height="24px" />
                  )}
                </Box>
              </Button>

              <Collapse in={isOpen} animateOpacity>
                <Box pt={4} id="how-to-measure-content" aria-hidden={!isOpen}>
                  {footMeasureOnline && footMeasureMarkup?.trim() && (
                    <HtmlContent content={footMeasureMarkup} fontSize="sm" />
                  )}
                </Box>
              </Collapse>
            </Box>
          </Box>

          <TableContainer
            sx={{
              ...styles.fitGuideTableContainer,
              height: isFitSizeAvailable ? '180px' : '350px',
            }}
          >
            <Table size="sm" sx={styles.fitGuideTable}>
              <Thead>
                <Tr>
                  <Th sx={styles.fitGuideTableHeaderCell}>
                    {formatMessage(
                      {
                        id: 'pdp.product.length',
                        defaultMessage: 'Length ({unit})',
                      },
                      { unit: unit.toLocaleLowerCase() }
                    )}
                  </Th>
                  <Th sx={styles.fitGuideTableHeaderCell}>
                    {formatMessage({
                      id: 'pdp.product.us',
                      defaultMessage: 'US',
                    })}
                  </Th>
                  <Th sx={styles.fitGuideTableHeaderCell}>
                    {formatMessage({
                      id: 'pdp.product.uk',
                      defaultMessage: 'UK',
                    })}
                  </Th>
                  <Th sx={styles.fitGuideTableHeaderCell}>
                    {formatMessage({
                      id: 'pdp.product.eu',
                      defaultMessage: 'EU',
                    })}
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {filteredAndSortedSizeData.map((row, index) => {
                  const isClosest = index === 0 && shouldHighlightClosestSizeRow

                  return (
                    <Tr key={row.length}>
                      <Td
                        sx={{
                          ...styles.fitGuideTableCell,
                          ...styles.fitGuideTableCellFirst,
                          ...(isClosest && styles.fitGuideTableCellActive),
                        }}
                      >
                        {getCurrentLength(row)}
                      </Td>

                      <Td
                        sx={{
                          ...styles.fitGuideTableCell,
                          ...(isClosest && styles.fitGuideTableCellActive),
                        }}
                      >
                        {row.us}
                      </Td>

                      <Td
                        sx={{
                          ...styles.fitGuideTableCell,
                          ...(isClosest && styles.fitGuideTableCellActive),
                        }}
                      >
                        {row.uk}
                      </Td>

                      <Td
                        sx={{
                          ...styles.fitGuideTableCell,
                          ...styles.fitGuideTableCellLast,
                          ...(isClosest && styles.fitGuideTableCellActive),
                        }}
                      >
                        {row.eu}
                      </Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </DrawerBody>
  )
}

export default FitGuide
