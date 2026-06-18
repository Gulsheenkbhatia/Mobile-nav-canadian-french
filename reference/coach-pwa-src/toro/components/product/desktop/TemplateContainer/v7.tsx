import TemplateThemeProvider from 'toro/components/TemplateThemeProvider'
import theme from 'pdpv7-desktop-theme'
import Box from 'toro/components/Box'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import RatingsAndReviewsSection from 'toro/components/product/desktop/RatingsAndReviewsSection'

const TemplateContainerModern = () => {
  const styles = useStyleConfig('TemplateContainer')
  return (
    <TemplateThemeProvider id="pdpv7" theme={theme}>
      <Box sx={styles}>
        <RatingsAndReviewsSection />
      </Box>
    </TemplateThemeProvider>
  )
}

export default TemplateContainerModern
