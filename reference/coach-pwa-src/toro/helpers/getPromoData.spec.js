import getPromoData from 'toro/helpers/getPromoData' // Import the module that contains the getPromoData function

describe('getPromoData', () => {
  it('returns promoPLP if it exists in activeProduct', () => {
    const activeProduct = {
      promoPLP: {
        promoCallOut: 'Promo Callout Message',
      },
    }
    const promoData = getPromoData(activeProduct)
    expect(promoData).toEqual({ promoCallOut: 'Promo Callout Message' })
  })

  it('returns promoData of activeVariant if activeColorId is provided', () => {
    const activeProduct = {
      variant: [
        {
          variationValues: {
            color: 'red',
          },
          promoPLP: {
            promoCallOut: [
              {
                'call-out-message': {
                  content: {
                    text: 'Red Promo Callout',
                    spanText: '',
                  },
                },
              },
            ],
          },
        },
        {
          variationValues: {
            color: 'blue',
          },
          promoPLP: {
            promoCallOut: [
              {
                'call-out-message': {
                  content: {
                    text: 'Blue Promo Callout',
                    spanText: '',
                  },
                },
              },
            ],
          },
        },
      ],
    }
    const activeColorId = 'red'
    const promoData = getPromoData(activeProduct, activeColorId)
    expect(promoData).toEqual([
      {
        'call-out-message': {
          content: {
            text: 'Red Promo Callout',
            spanText: '',
          },
        },
      },
    ])
  })

  it('returns promoData of activeVariant if activeColorId is provided and has multiple valid promos', () => {
    const activeProduct = {
      variant: [
        {
          variationValues: {
            color: 'red',
          },
          promoPLP: {
            promoCallOut: [
              {
                'call-out-message': {
                  content: {
                    text: 'Red Promo 1',
                    spanText: '',
                  },
                },
              },
              {
                'call-out-message': {
                  content: {
                    text: '',
                    spanText: 'Red Promo 2',
                  },
                },
              },
            ],
          },
        },
      ],
    }
    const activeColorId = 'red'
    const promoData = getPromoData(activeProduct, activeColorId)
    expect(promoData).toEqual([
      {
        'call-out-message': {
          content: {
            text: 'Red Promo 1',
            spanText: '',
          },
        },
      },
      {
        'call-out-message': {
          content: {
            text: '',
            spanText: 'Red Promo 2',
          },
        },
      },
    ])
  })

  it('returns empty array if promoPLP and activeVariant are not found', () => {
    const activeProduct = {
      variant: [
        {
          variationValues: {
            color: 'green',
          },
        },
        {
          variationValues: {
            color: 'blue',
          },
        },
      ],
    }
    const activeColorId = 'red'
    const promoData = getPromoData(activeProduct, activeColorId)
    expect(promoData).toEqual([])
  })

  it('returns promoPLP if activeProduct has incorrect format', () => {
    const activeProduct = {
      promoPLP: [
        {
          'call-out-message': {
            content: {
              text: 'Promo 1',
              spanText: '',
            },
          },
        },
        {
          'call-out-message': {
            content: {
              text: '',
              spanText: 'Promo 2',
            },
          },
        },
      ],
    }
    const promoData = getPromoData(activeProduct)
    expect(promoData).toEqual([
      {
        'call-out-message': {
          content: {
            text: 'Promo 1',
            spanText: '',
          },
        },
      },
      {
        'call-out-message': {
          content: {
            text: '',
            spanText: 'Promo 2',
          },
        },
      },
    ])
  })

  it('returns undefined if activeProduct is an empty object', () => {
    const activeProduct = {}
    const promoData = getPromoData(activeProduct)
    expect(promoData).toBeUndefined()
  })
})
