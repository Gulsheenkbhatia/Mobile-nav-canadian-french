import { useCallback, useEffect, useState } from 'react'
import { useAtomValue } from 'jotai/utils'
import { useIntl } from 'react-intl'
import Box from 'toro/components/Box'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import usePageType from 'toro/hooks/usePageType'
import { xgenClientAtom } from 'store/xgen.atom'
import { ResponseRecommendations } from 'toro/components/RecommendationsContainer/types'
import { XgenContainerID } from 'toro/lib/xgen'

const GoneViralRecommendation = () => {
  const { formatMessage } = useIntl()
  const { isPDP } = usePageType()
  const xgenClient = useAtomValue(xgenClientAtom)
  const [productCount, setProductCount] = useState<number>(0)
  const [hasResponse, setHasResponse] = useState(false)

  const styles = useMultiStyleConfig('GoneViralRecommendation', {
    variant: isPDP ? 'pdp' : undefined,
  })

  useEffect(() => {
    const search = new URLSearchParams(window.location.search)
    const itemLabel = search.get('itemlabel')

    if (itemLabel && xgenClient) {
      xgenClient.recommendations.setContext({
        prodList: itemLabel.replaceAll('|', ','),
      })
    }
  }, [xgenClient])

  const handleRecommendationResponse = useCallback(
    (response: ResponseRecommendations) => {
      setHasResponse(true)
      setProductCount(response?.items?.length || 0)
      if (xgenClient) {
        xgenClient.recommendations.setContext({
          prodList: undefined,
        })
      }
    },
    [xgenClient]
  )

  const title = formatMessage({
    id: `${isPDP ? 'pdp' : 'plp'}.goneViral.title`,
    defaultMessage: 'Gone Viral',
  })

  const subTitle = formatMessage({
    id: `${isPDP ? 'pdp' : 'plp'}.goneViral.subtitle`,
    defaultMessage: 'Trending on Social',
  })

  if (hasResponse && productCount === 0) {
    return null
  }

  return (
    <Box sx={styles.goneViralWrapper}>
      <Box
        sx={{
          ...styles.goneViralContainer,
          ...(productCount === 1 && styles.containerOneItem),
        }}
      >
        <Box sx={styles.titleContainer}>
          <Box as="h4" sx={styles.subtitle}>
            {subTitle}
          </Box>
          <Box as="h2" sx={styles.title} data-qa="goneViral-title">
            {title}
          </Box>
        </Box>
        <RecommendationsContainer
          type={XgenContainerID.sm_el_sitewide1}
          variant={isPDP ? 'goneViralRecommendation' : 'goneViralRecommendationPLP'}
          onResponse={handleRecommendationResponse}
          hideLabel={true}
          hideWishlist={true}
          showRecommendationTitle={false}
        />
      </Box>
    </Box>
  )
}

export default GoneViralRecommendation
