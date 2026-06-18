type PageData = {
  priceType: string | undefined
  isSPC: boolean | undefined
  isFPC: boolean | undefined
}

function getPriceType(pageData: PageData) {
  if (pageData?.priceType === 'salePrice' || pageData?.isSPC) {
    return 'salePrice'
  } else if (pageData?.priceType === 'fullPrice' || pageData?.isFPC) {
    return 'fullPrice'
  } else {
    return 'allPrice'
  }
}

export default getPriceType
