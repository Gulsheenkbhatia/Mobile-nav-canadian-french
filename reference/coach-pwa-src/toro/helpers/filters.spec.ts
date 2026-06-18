import { getOptionQAAttribute } from 'toro/helpers/filters'

describe('Filters', () => {
  describe('getOptionQAAttribute', () => {
    it('option selected', () => {
      const result = getOptionQAAttribute({
        selected: true,
        enabled: true,
        refinementName: 'categories',
      })
      expect(result).toMatch('plpfltr_link_fltr_categories_swatch_slctd')
    })
    it('option enabled', () => {
      const result = getOptionQAAttribute({
        selected: false,
        enabled: true,
        refinementName: 'categories',
      })
      expect(result).toMatch('plpfltr_link_fltr_categories_swatch_enbld')
    })
    it('option disabled', () => {
      const result = getOptionQAAttribute({
        selected: false,
        enabled: false,
        refinementName: 'categories',
      })
      expect(result).toMatch('plpfltr_link_fltr_categories_swatch_dsbld')
    })
  })

  // TODO: add other tests
})
