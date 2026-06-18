import last from 'lodash/last'

const productIdRegexRegular = new RegExp(/^[ A-Za-z0-9+_\-\/%\.]{3,40}$/g)

const isCorrectProductId = (opts) => {
  const { slug } = opts.query
  const productId = last(slug)?.replace('.html', '')
  return productId && Boolean(productId?.match(productIdRegexRegular))
}

export default isCorrectProductId
