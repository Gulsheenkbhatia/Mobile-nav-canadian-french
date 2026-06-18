import getPrefValueFromNextData from 'toro/helpers/getPrefValueFromNextData'

const nextData = {
  props: {
    pageProps: {
      appData: {
        preferences: {
          plpTemplateConfigurations: [
            { id: 'plpTemplateVersion', value: 'PLPV3' },
            { id: 'HideDiscountPercentageOnPLP', value: true },
          ],
        },
      },
    },
  },
}

describe('src/toro/helpers/getPrefValueFromNextData', () => {
  it('return plpTemplateVersion value from preferences in nextData', async () => {
    expect(
      getPrefValueFromNextData(nextData, 'plpTemplateConfigurations', 'plpTemplateVersion')
    ).toBe('PLPV3')
  })
  it('return HideDiscountPercentageOnPLP value from preferences in nextData', async () => {
    expect(
      getPrefValueFromNextData(nextData, 'plpTemplateConfigurations', 'HideDiscountPercentageOnPLP')
    ).toBe(true)
  })
})
