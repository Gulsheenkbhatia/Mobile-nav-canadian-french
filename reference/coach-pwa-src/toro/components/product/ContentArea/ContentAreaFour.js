import { useRef, useEffect } from 'react'
import usePreference from 'toro/hooks/usePreference_new'
import Lazy from 'toro/components/Lazy'
import CustomSlot from 'toro/cms/components/CustomSlot'
import ContentAreaFourCmsSlot from 'toro/components/product/ContentArea/ContentAreaFourCmsSlot'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useCmsAnalytics from 'toro/analytics/useCmsAnalytics'
import PropTypes from 'prop-types'

function ContentAreaFour({ content, contentAreaCustomAttribute }) {
  const {
    brandProdAttributes: { isEnableContentFour },
  } = usePreference({
    brandProdAttributes: ['isEnableContentFour'],
  })

  const {
    brandProdAttributes: { pdpContentAreaFour },
  } = usePreference({
    brandProdAttributes: ['pdpContentAreaFour'],
  })

  const existContentAreaFourValue = contentAreaCustomAttribute || pdpContentAreaFour

  const promoBannerNode = useRef(null)
  const { contentUpdated } = useCmsAnalytics(promoBannerNode)

  useEffect(() => contentUpdated(), [content])

  if (!isEnableContentFour && !existContentAreaFourValue) {
    return null
  }

  return (
    <Lazy>
      <CustomSlot ignoreHidden={true} Component={ContentAreaFourCmsSlot} content={content} />
    </Lazy>
  )
}

ContentAreaFour.propTypes = {
  content: PropTypes.object,
  productData: PropTypes.object,
}

export default withErrorBoundaryWrapper(ContentAreaFour)
