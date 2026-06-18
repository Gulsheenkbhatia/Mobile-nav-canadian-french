import { useCallback, memo } from 'react'
import { PRODUCT_MEDIA_TYPES } from 'toro/constants/ProductMediaTypes'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'

/**
 * Renders large product media item (image|video) in PDP media carousel
 *
 * @param  {JSX.Element<Record<string, any>>} type type of media content
 *
 */
const ProductMedia = ({ type, ...props }) => {
  const mediaType = PRODUCT_MEDIA_TYPES[type]

  const { Component } = mediaType || { Component: null }

  const getProductMedia = useCallback(() => {
    return Component ? <Component {...props} /> : null
  }, [props])

  return <>{getProductMedia()}</>
}

ProductMedia.propTypes = {
  type: PropTypes.string,
}

ProductMedia.defaultProps = {
  type: 'image',
}

export default memo(withErrorBoundaryWrapper(ProductMedia))
