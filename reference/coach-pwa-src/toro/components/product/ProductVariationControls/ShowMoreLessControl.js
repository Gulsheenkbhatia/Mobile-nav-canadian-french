import { useIntl } from 'react-intl'
import { useMemo } from 'react'
import ShowMoreShowLess from 'toro/components/product/ProductVariationControls/ShowMoreShowLess'

function ShowMoreLessControl({ items, isShowMore, setShowMore, maxSwatch, isQuickView }) {
  const { formatMessage } = useIntl()
  const shouldDisplayShowMoreLess = items?.length >= maxSwatch && !isQuickView
  const isShowLess = shouldDisplayShowMoreLess && !isShowMore

  const text = useMemo(() => {
    if (!shouldDisplayShowMoreLess) return ''

    if (isShowLess) {
      return formatMessage({
        id: 'pdp.product.showLessText',
        defaultMessage: 'Show less',
      })
    } else {
      return `+${items?.length - maxSwatch + 1} ${formatMessage({
        id: 'pdp.product.moreText',
        defaultMessage: 'More',
      })}`
    }
  }, [isShowLess, shouldDisplayShowMoreLess, items?.length, maxSwatch, isQuickView])

  if (shouldDisplayShowMoreLess) {
    return <ShowMoreShowLess text={text} onClick={() => setShowMore(!isShowMore)} />
  }

  return null
}

export default ShowMoreLessControl
