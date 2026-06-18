import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import Text from 'toro/components/Text'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import Link from 'toro/components/Link'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePreference from 'toro/hooks/usePreference_new'
import type { ProductUnionMap } from 'toro/types/productTypes/normalizers'

type InfoCardKey =
  | 'shellMaterials'
  | 'coachtopiaLiningMaterial'
  | 'hangtagMaterial'
  | 'productLifeCycle'
  | 'manufacturer'

const infoCardRowsMapping: Record<InfoCardKey, string> = {
  shellMaterials: 'Shell',
  coachtopiaLiningMaterial: 'Lining',
  hangtagMaterial: 'Hangtag',
  productLifeCycle: 'Lifecycle',
  manufacturer: 'Made in',
}

interface QaAttributeEntry {
  label: string
  value: string
}

const qaAttributes: Record<InfoCardKey, QaAttributeEntry> = {
  shellMaterials: {
    label: 'ppp_ergo_label_pdt_attrib_Shell',
    value: 'ppp_ergo_txt_pdt_attrib_value_Shell',
  },
  coachtopiaLiningMaterial: {
    label: 'ppp_ergo_label_pdt_attrib_Lining',
    value: 'ppp_ergo_txt_pdt_attrib_value_Lining',
  },
  hangtagMaterial: {
    label: 'ppp_ergo_label_pdt_attrib_Resin_Hangtag',
    value: 'ppp_ergo_txt_pdt_attrib_value_Resin_Hangtag',
  },
  productLifeCycle: {
    label: 'ppp_ergo_label_pdt_attrib_Lifecycle',
    value: 'ppp_ergo_txt_pdt_attrib_value_Lifecycle',
  },
  manufacturer: {
    label: 'ppp_ergo_label_pdt_attrib_Made_in',
    value: 'ppp_ergo_txt_pdt_attrib_value_Made_in',
  },
}

interface ProductDetailsProps {
  attributes: ProductUnionMap
}

const ProductDetails = ({ attributes }: ProductDetailsProps) => {
  const { formatMessage } = useIntl()
  const styles = useMultiStyleConfig('PassportProductDetails')

  const {
    coachtopia: { careInstructionsCTALink },
  } = usePreference({ coachtopia: ['careInstructionsCTALink'] })

  const infoRows = useMemo(
    () =>
      Object.entries(infoCardRowsMapping)
        .map(([key, defaultTitle]) => {
          const rawValue = attributes[key]
          const value = typeof rawValue === 'string' ? rawValue : null
          if (!value) return null
          return {
            title: formatMessage({ id: `home.passport.${key}`, defaultMessage: defaultTitle }),
            value,
            dataQaLabel: qaAttributes[key as InfoCardKey]?.label,
            dataQaValue: qaAttributes[key as InfoCardKey]?.value,
          }
        })
        .filter(Boolean),
    [attributes]
  )

  if (!infoRows.length) return null

  return (
    <Box sx={styles.rootWrapper}>
      <Box sx={styles.infoCard}>
        <Box sx={styles.infoCardContainer}>
          <Text sx={styles.infoCardTitle}>
            {formatMessage({
              id: 'home.passport.productDetails',
              defaultMessage: 'Product Details',
            })}
          </Text>
          <Box sx={styles.infoCardContent}>
            {infoRows.map((row) => (
              <Box key={row.title} sx={styles.detailsDescriptionRow}>
                <Text sx={styles.detailsDescriptionTitle} data-qa={row.dataQaLabel}>
                  {row.title}
                </Text>
                <Text
                  variant="body-primary-sm-bold"
                  sx={styles.detailsDescriptionText}
                  data-qa={row.dataQaValue}
                >
                  {row.value}
                </Text>
              </Box>
            ))}
          </Box>
          {!!careInstructionsCTALink && (
            <Link href={careInstructionsCTALink} target="_blank">
              <Button sx={styles.button} size="lg">
                {formatMessage({
                  id: 'home.passport.careInstructions',
                  defaultMessage: 'Care Instructions',
                })}
              </Button>
            </Link>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ProductDetails
