import getPriceType from 'toro/helpers/getPriceType'

describe('getPriceType', () => {
  describe('salePrice cases', () => {
    it('salePrice predefined', () => {
      const priceType = getPriceType({
        priceType: 'salePrice',
        isSPC: false,
        isFPC: false,
      })

      expect(priceType).toMatch('salePrice')
    })
    it('SPC enabled', () => {
      const priceType = getPriceType({
        priceType: 'fullPrice',
        isSPC: true,
        isFPC: false,
      })

      expect(priceType).toMatch('salePrice')
    })
  })
  describe('fullPrice cases', () => {
    it('salePrice predefined', () => {
      const priceType = getPriceType({
        priceType: 'fullPrice',
        isSPC: false,
        isFPC: false,
      })

      expect(priceType).toMatch('fullPrice')
    })
    it('FPC enabled', () => {
      const priceType = getPriceType({
        priceType: 'allPrice',
        isSPC: false,
        isFPC: true,
      })

      expect(priceType).toMatch('fullPrice')
    })
  })
  describe('allPrice cases', () => {
    it('priceType specified and product costs not specified', () => {
      const priceType = getPriceType({
        priceType: 'allPrice',
        isSPC: false,
        isFPC: false,
      })

      expect(priceType).toMatch('allPrice')
    })
    it('any other priceType and product costs not specified', () => {
      const priceType = getPriceType({
        priceType: 'any other',
        isSPC: false,
        isFPC: false,
      })

      expect(priceType).toMatch('allPrice')
    })
  })
})
