import { styles } from 'toro/components/product/mobile/styles'
import RatingsAndReviews from 'toro/components/product/mobile/v7/RatingsAndReviewsSection/theme/theme'
import ProductCompareTool from 'toro/components/product/mobile/ProductCompareTool/theme'
import UGC from 'toro/components/product/mobile/UGC/theme/theme'
import RecommendationsContainer from 'toro/components/product/mobile/RecommendationsContainer/theme'
import RecommendationsSlider from 'toro/components/product/mobile/RecommendationsSlider/themes/theme'

const pdpModernTheme = {
  styles,
  components: {
    RatingsAndReviews,
    ProductCompareTool,
    UGC,
    RecommendationsContainer,
    RecommendationsSlider,
    TemplateContainerV7: {
      baseStyle: {
        container: {
          backgroundColor: 'var(--color-neutral-light)',
          pb: 'var(--spacing-1)',
        },
        lowerStack: {
          backgroundColor: 'var(--color-neutral-light-1, #F0F0F0)',
          display: 'flex',
          flexDirection: 'column',
        },
        ugcContainer: {
          '& #social-section .links-container': {
            display: 'none',
          },
        },
      },
    },
  },
}

export default pdpModernTheme
