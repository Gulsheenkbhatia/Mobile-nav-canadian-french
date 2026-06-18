import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'
import pick from 'lodash/pick'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import { productTileSections } from 'toro/constants/productList'
import { useMemo } from 'react'
import useTheme from 'toro/hooks/useTheme'
import Box from 'toro/components/Box'
import { PriceTemplate as PriceTemplateEnum } from 'toro/types/productTypes'

const templateParts = {
  singlePriceTemplate: ['value'],
  comparableTemplate: ['value', 'comparable'],
  discountTemplate: ['value', 'discount'],
  fullPriceComparableTemplate: ['value', 'comparable', 'discount'],
  strikeoffPriceTemplate: ['value', 'strikeoff'],
  fullPriceTemplate: ['value', 'strikeoff', 'discount'],
}
interface PriceTemplateProps {
  template: PriceTemplateEnum
  variant?: string
  productPrice: {
    value: string
    comparable?: string
    strikeoff?: string
    discount?: string
  }
  // TODO: move showOnlySinglePrice override to server-side
  showOnlySinglePrice?: boolean
}
const PriceTemplate = ({
  template,
  variant,
  productPrice,
  showOnlySinglePrice,
}: PriceTemplateProps) => {
  const pricing = useMemo(() => {
    const priceParts = showOnlySinglePrice
      ? templateParts.singlePriceTemplate
      : templateParts[template]
    return pick(productPrice, priceParts)
  }, [productPrice, template, showOnlySinglePrice])
  const styles = useMultiStyleConfig('Price', { variant })
  const { formatMessage } = useIntl()
  const theme = useTheme()

  const textProps = useMemo(
    () => ({
      as: 'span',
      variant: 'body-text-secondary',
      size: 'md',
      ...styles.mainPrice({ showRed: false }),
    }),
    [theme, styles.mainPrice]
  )

  const strikethroughTextProps = useMemo(
    () => ({
      color: theme.colors.main.gray,
      textDecoration: 'line-through',
      ml: theme.space.s,
      ...textProps,
    }),
    [theme, textProps]
  )

  const comparableValueTextProps = useMemo(
    () => ({
      ...textProps,
      size: 'sm',
      color: theme.colors.neutral.dark,
    }),
    [theme, textProps]
  )

  const discountPercentageTextProps = useMemo(() => {
    return {
      ...textProps,
      color: theme.colors.main.gray,
    }
  }, [textProps, theme, pricing?.comparable])

  return (
    <Flex
      flexWrap="wrap"
      justifyContent="start"
      flexDirection="column"
      data-qa="search_suggestion_pricing_wrapper"
      className={`pricing-wrapper ${pricing?.comparable ? 'with-comparable-price' : ''} `}
      sx={styles?.priceWrapper?.()}
    >
      <Box className={productTileSections.comparablePrice.containerClass}>
        {pricing?.comparable && (
          <Flex
            className={productTileSections.comparablePrice.contentClass}
            data-qa="wrapper_comparable_value"
            sx={styles.comparablePriceWrapper}
          >
            <Text
              data-qa="txt_comparable_value"
              {...comparableValueTextProps}
              mr="4px"
              sx={styles.oneCoachComparablePriceTheme}
            >
              {formatMessage({
                id: 'plp.price.comparablevalue',
                defaultMessage: 'Comparable Value',
              })}
            </Text>
            <Text
              data-qa="txt_comparable_value_price"
              {...comparableValueTextProps}
              sx={styles.oneCoachComparablePriceTheme}
            >
              {pricing?.comparable}
            </Text>
          </Flex>
        )}
      </Box>
      <Flex className="salePriceWrapper" sx={styles.renderSalePriceWrapper}>
        <Text
          className={'salesPrice'}
          sx={{
            ...styles.prices,
          }}
          {...textProps}
          data-qa={pricing?.discount ? 'm_plp_txt_pt_price_upper_rl' : 'cm_txt_pdt_price'}
        >
          {pricing.value}
        </Text>

        {pricing?.strikeoff && (
          <Text
            {...strikethroughTextProps}
            data-qa="cm_txt_pdt_price_strthr"
            sx={{
              ...styles.prices,
              ...styles?.discPercent(),
              ...styles.strikethroughListPriceText,
            }}
          >
            {pricing?.strikeoff}
          </Text>
        )}

        {pricing?.discount && (
          <Text
            {...discountPercentageTextProps}
            sx={{ ...styles.prices, ...styles?.discPercent() }}
            data-qa="cm_txt_pdt_price_dpercent"
          >
            ({pricing?.discount}% off)
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export default PriceTemplate
