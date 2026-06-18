import { getSubBrandConfig } from 'toro/helpers/getSubBrandConfig'

describe('src/helpers/getSubBrandConfig.js', () => {
  const env = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { SUB_BRAND: 'coachtopia', BRAND: 'coach' }
  })

  afterEach(() => {
    process.env = env
  })

  it('should return the isSubBrandEnabled and isSubBrandActive true with enable as a string', () => {
    const subBrandConfig = [
      {
        id: 'coachtopiaGlobalConfig',
        value: [
          {
            locale: 'en_US',
            enable: 'true',
            tabheader: false,
            reducedheaderfooter: false,
          },
        ],
      },
      {
        id: 'enableCoachTopia',
        value: true,
      },
    ]
    const oneCoachConfig = [
      {
        id: 'oneCoachTabConfig',
        value: {
          name: 'Coach',
          enable: 'true',
          link: '/?utm_medium=referral&utm_source=tabbed-nav&utm_campaign=coach.com',
        },
      },
    ]
    const locale = 'en-US'

    const { isSubBrandEnabled, isSubBrandActive, brandCookieValue } = getSubBrandConfig(
      subBrandConfig,
      oneCoachConfig,
      locale,
      '/shop/coachtopia'
    )
    expect(isSubBrandEnabled).toEqual(true)
    expect(isSubBrandActive).toEqual(true)
    expect(brandCookieValue).toEqual('coachtopia')
  })

  it('should return the isSubBrandEnabled true and isSubBrandActive false with enable as a string', () => {
    const subBrandConfig = [
      {
        id: 'coachtopiaGlobalConfig',
        value: [
          {
            locale: 'en_US',
            enable: 'true',
            tabheader: false,
            reducedheaderfooter: false,
          },
        ],
      },
      {
        id: 'enableCoachTopia',
        value: true,
      },
    ]
    const oneCoachConfig = [
      {
        id: 'oneCoachTabConfig',
        value: {
          name: 'Coach',
          enable: 'true',
          link: '/?utm_medium=referral&utm_source=tabbed-nav&utm_campaign=coach.com',
        },
      },
    ]
    const locale = 'en-US'

    const { isSubBrandEnabled, isSubBrandActive, brandCookieValue } = getSubBrandConfig(
      subBrandConfig,
      oneCoachConfig,
      locale,
      '/'
    )
    expect(isSubBrandEnabled).toEqual(true)
    expect(isSubBrandActive).toEqual(false)
    expect(brandCookieValue).toEqual('coach')
  })

  it('should return the isSubBrandEnabled false and isSubBrandActive false with subBrand disabled', () => {
    const subBrandConfig = [
      {
        id: 'coachtopiaGlobalConfig',
        value: [
          {
            locale: 'en_US',
            enable: false,
            tabheader: false,
            reducedheaderfooter: false,
          },
        ],
      },
      {
        id: 'enableCoachTopia',
        value: true,
      },
    ]
    const locale = 'en-US'

    const { isSubBrandEnabled, isSubBrandActive, brandCookieValue } = getSubBrandConfig(
      subBrandConfig,
      locale,
      '/shop/women'
    )
    expect(isSubBrandEnabled).toEqual(false)
    expect(isSubBrandActive).toEqual(false)
    expect(brandCookieValue).toEqual('coach')
  })

  it('should return the isSubBrandEnabled false and isSubBrandActive false with subBrand disabled', () => {
    const subBrandConfig = [
      {
        id: 'coachtopiaGlobalConfig',
        value: [
          {
            locale: 'en_US',
            enable: false,
            tabheader: false,
            reducedheaderfooter: false,
          },
        ],
      },
      {
        id: 'enableCoachTopia',
        value: false,
      },
    ]
    const locale = 'en-US'

    const { isSubBrandEnabled, isSubBrandActive, brandCookieValue } = getSubBrandConfig(
      subBrandConfig,
      locale,
      '/products/5052'
    )
    expect(isSubBrandEnabled).toEqual(false)
    expect(isSubBrandActive).toEqual(false)
    expect(brandCookieValue).toEqual('coach')
  })

  it('should return the isSubBrandEnabled true and isSubBrandActive true with enable as a boolean', () => {
    const subBrandConfig = [
      {
        id: 'coachtopiaGlobalConfig',
        value: [
          {
            locale: 'en_US',
            enable: true,
            tabheader: false,
            reducedheaderfooter: false,
          },
        ],
      },
      {
        id: 'enableCoachTopia',
        value: true,
      },
    ]
    const oneCoachConfig = [
      {
        id: 'oneCoachTabConfig',
        value: {
          name: 'Coach',
          enable: 'true',
          link: '/?utm_medium=referral&utm_source=tabbed-nav&utm_campaign=coach.com',
        },
      },
    ]
    const locale = 'en-US'

    const { isSubBrandEnabled, isSubBrandActive, brandCookieValue } = getSubBrandConfig(
      subBrandConfig,
      oneCoachConfig,
      locale,
      '',
      { brand: 'coachtopia', isCoachtopia: false }
    )
    expect(isSubBrandEnabled).toEqual(true)
    expect(isSubBrandActive).toEqual(true)
    expect(brandCookieValue).toEqual('coachtopia')
  })

  it('should return the isSubBrandEnabled true and isSubBrandActive true with enable as a boolean', () => {
    const subBrandConfig = [
      {
        id: 'coachtopiaGlobalConfig',
        value: [
          {
            locale: 'en_US',
            enable: true,
            tabheader: false,
            reducedheaderfooter: false,
          },
        ],
      },
      {
        id: 'enableCoachTopia',
        value: true,
      },
    ]
    const oneCoachConfig = [
      {
        id: 'oneCoachTabConfig',
        value: {
          name: 'Coach',
          enable: 'true',
          link: '/?utm_medium=referral&utm_source=tabbed-nav&utm_campaign=coach.com',
        },
      },
    ]
    const locale = 'en-US'

    const { isSubBrandEnabled, isSubBrandActive, brandCookieValue } = getSubBrandConfig(
      subBrandConfig,
      oneCoachConfig,
      locale,
      '',
      { brand: 'coach', isCoachtopia: true }
    )
    expect(isSubBrandEnabled).toEqual(true)
    expect(isSubBrandActive).toEqual(true)
    expect(brandCookieValue).toEqual('coachtopia')
  })

  it('should return the isSubBrandEnabled true and isSubBrandActive true with enable as a boolean', () => {
    const subBrandConfig = [
      {
        id: 'coachtopiaGlobalConfig',
        value: [
          {
            locale: 'en_US',
            enable: true,
            tabheader: false,
            reducedheaderfooter: false,
          },
        ],
      },
      {
        id: 'enableCoachTopia',
        value: true,
      },
    ]
    const oneCoachConfig = [
      {
        id: 'oneCoachTabConfig',
        value: {
          name: 'Coach',
          enable: 'true',
          link: '/?utm_medium=referral&utm_source=tabbed-nav&utm_campaign=coach.com',
        },
      },
    ]
    const locale = 'en-US'

    const { isSubBrandEnabled, isSubBrandActive, brandCookieValue } = getSubBrandConfig(
      subBrandConfig,
      oneCoachConfig,
      locale,
      '',
      { isCoachtopia: true }
    )
    expect(isSubBrandEnabled).toEqual(true)
    expect(isSubBrandActive).toEqual(true)
    expect(brandCookieValue).toEqual('coachtopia')
  })

  it('should return the isSubBrandEnabled true and isSubBrandActive false with enable as a boolean', () => {
    const subBrandConfig = [
      {
        id: 'coachtopiaGlobalConfig',
        value: [
          {
            locale: 'en_US',
            enable: true,
            tabheader: false,
            reducedheaderfooter: false,
          },
        ],
      },
      {
        id: 'enableCoachTopia',
        value: true,
      },
    ]
    const oneCoachConfig = [
      {
        id: 'oneCoachTabConfig',
        value: {
          name: 'Coach',
          enable: 'true',
          link: '/?utm_medium=referral&utm_source=tabbed-nav&utm_campaign=coach.com',
        },
      },
    ]
    const locale = 'en-US'

    const { isSubBrandEnabled, isSubBrandActive, brandCookieValue } = getSubBrandConfig(
      subBrandConfig,
      oneCoachConfig,
      locale,
      '',
      { brand: 'coach', isCoachtopia: false }
    )
    expect(isSubBrandEnabled).toEqual(true)
    expect(isSubBrandActive).toEqual(false)
    expect(brandCookieValue).toEqual('coach')
  })
})
