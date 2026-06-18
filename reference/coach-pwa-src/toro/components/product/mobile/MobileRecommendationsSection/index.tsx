import React from 'react'
import Box from 'toro/components/Box'
import { useMultiStyleConfig } from '@chakra-ui/react'
import StylesProvider from 'toro/components/StylesProvider'
import MobileRecommendations from 'toro/components/RecommendationsContainer/MobileRecommendations'
import RecommendationItem from 'toro/components/Certona/RecommendationItem'

interface MobileRecommendationsSectionProps {
  title?: string
  products: any[]
  hidePrice?: boolean
  addImpression: (payload: any) => void
  selectRecommItem: (payload: any) => void | Promise<void>
  scheme?: string
}

const MobileRecommendationsSection: React.FC<MobileRecommendationsSectionProps> = ({
  title,
  products,
  hidePrice,
  addImpression,
  selectRecommItem,
  scheme,
}) => {
  const styles = useMultiStyleConfig('RecommendationsContainer')

  return (
    <StylesProvider value={styles}>
      <Box sx={styles.baseRecommendationWrapper}>
        {title && (
          <Box as="h2" sx={styles.baseRecommendationTitle}>
            {title}
          </Box>
        )}
        <MobileRecommendations>
          {products.map((product, idx) => (
            <RecommendationItem
              key={product.ID}
              product={product}
              idx={idx}
              viewport="mobile"
              hidePrice={hidePrice}
              addImpression={addImpression}
              selectRecommItem={selectRecommItem}
              scheme={scheme}
              label={title}
              hideWishlist={true}
            />
          ))}
        </MobileRecommendations>
      </Box>
    </StylesProvider>
  )
}

export default MobileRecommendationsSection
