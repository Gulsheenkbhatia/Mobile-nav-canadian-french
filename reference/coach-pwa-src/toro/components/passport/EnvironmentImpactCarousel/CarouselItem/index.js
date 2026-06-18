import { Fragment } from 'react'
import dynamic from 'next/dynamic'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Link from 'toro/components/Link'
import { useIntl } from 'react-intl'

const FallbackEmptyIcon = () => <Fragment />

const getDynamicIcon = (path) => {
  try {
    const res = dynamic(
      () =>
        import(`@tapestry-inc/design-tokens/coachtopia/icon/object/${path}`).catch(
          () => FallbackEmptyIcon
        ),
      {
        ssr: false,
      }
    )
    return res
  } catch (_err) {
    return FallbackEmptyIcon
  }
}

const CarouselItem = ({ title, value, description, icon, viewMoreUrl, styles }) => {
  const { formatMessage } = useIntl()
  const Icon = getDynamicIcon(icon)

  return (
    <Box sx={styles.cardRoot} className="env-impact-slide">
      {!!value && <Text sx={styles.cardValue}>{value}</Text>}
      <Text variant="body-primary-md" sx={styles.cardTitle(!!value)}>
        {title}
      </Text>
      <Icon />
      <Text sx={styles.cardDescription} variant="body-primary-sm">
        {description}
      </Text>
      {!!viewMoreUrl && (
        <Link sx={styles.cardLink} href={viewMoreUrl} target="_blank">
          {formatMessage({
            id: 'pdp.product.envImpact.viewMore',
            defaultMessage: 'View more',
          })}
        </Link>
      )}
    </Box>
  )
}

export default CarouselItem
