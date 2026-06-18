import Box from 'toro/components/Box'
import Link from 'toro/components/Link'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import { useIntl } from 'react-intl'

export default function ATBDrawerRecommendationsCTA({
  url,
  linkInCarousel = false,
  onClickATCDrawerRecommendationLink,
}) {
  const { ATCDrawerRecommendationLink, ATCDrawerRecommendationCarouselItem } =
    useMultiStyleConfig('AddToBagDrawer')
  const { formatMessage } = useIntl()

  return (
    <Box sx={linkInCarousel ? ATCDrawerRecommendationCarouselItem : ATCDrawerRecommendationLink}>
      <Link href={url} onClick={onClickATCDrawerRecommendationLink}>
        {formatMessage({
          id: 'pdp.rec.viewmore.text',
          defaultMessage: 'Explore More',
        })}
      </Link>
    </Box>
  )
}
