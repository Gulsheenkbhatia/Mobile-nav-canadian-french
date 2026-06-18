import InjectSgloaderScript from 'toro/components/InjectSgloaderScript'
import { render } from 'test-utils/react'
import { getPreferencesMock } from 'test-utils/mock-utils'

const renderOptions = {
  contexts: {
    PWAContext: {},
    ViewportContext: {},
    AnalyticsContext: {},
  },
}

const makeSetup = (customRenderOptions) => {
  return render(<InjectSgloaderScript />, customRenderOptions || renderOptions)
}

describe('Inject of SGloader.js script', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  const src = `https://cdn.staging1.shoppinggives.com/cc-utilities/sgloader.js?sid=8353b0be-726f-4552-b942-a94c1322c2f8&test-mode=true`
  const DATA_NCSRIPT = 'afterInteractive'

  it('should render script when all setup exist', async () => {
    const { baseElement } = makeSetup({
      contexts: {
        PWAContext: {
          appData: {
            siteId: 'coh_us_rt',
            shoppingGivesIsTest: true,
            preferences: getPreferencesMock({
              ShoppingGives: {
                enableShoppingGives: true,
                storeIdShoppingGives: '8353b0be-726f-4552-b942-a94c1322c2f8',
                urlforShoppingGives:
                  'https://cdn.staging1.shoppinggives.com/cc-utilities/sgloader.js',
              },
            }),
          },
        },
      },
    })

    expect(
      baseElement.querySelector(`script[src="${src}"][data-nscript="${DATA_NCSRIPT}"]`)
    ).toBeInTheDocument()
  })
  it('should not render script when all of the setup doesnt exist', () => {
    const { baseElement } = makeSetup(renderOptions)
    expect(
      baseElement.querySelector(`script[src="${src}"][data-nscript="${DATA_NCSRIPT}"]`)
    ).toBeNull()
  })
  it('should not render script when BM pref is truned off', () => {
    const { baseElement } = makeSetup({
      contexts: {
        PWAContext: {
          appData: {
            siteId: 'coh_us_rt',
            shoppingGivesIsTest: true,
            preferences: getPreferencesMock({
              ShoppingGives: {
                enableShoppingGives: false,
                storeIdShoppingGives: '8353b0be-726f-4552-b942-a94c1322c2f8',
                urlforShoppingGives:
                  'https://cdn.staging1.shoppinggives.com/cc-utilities/sgloader.js',
              },
            }),
          },
        },
      },
    })
    expect(
      baseElement.querySelector(`script[src="${src}"][data-nscript="${DATA_NCSRIPT}"]`)
    ).toBeNull()
  })
  it('should not render script when url from BM is missed', () => {
    const { baseElement } = makeSetup({
      contexts: {
        PWAContext: {
          appData: {
            siteId: 'coh_us_rt',
            shoppingGivesIsTest: true,
            preferences: getPreferencesMock({
              ShoppingGives: {
                enableShoppingGives: true,
                storeIdShoppingGives: '8353b0be-726f-4552-b942-a94c1322c2f8',
                urlforShoppingGives: '',
              },
            }),
          },
        },
      },
    })
    expect(
      baseElement.querySelector(`script[src="${src}"][data-nscript="${DATA_NCSRIPT}"]`)
    ).toBeNull()
  })
  it('should not render script when storeId BM pref is missed', () => {
    const { baseElement } = makeSetup({
      contexts: {
        PWAContext: {
          appData: {
            siteId: 'coh_us_rt',
            shoppingGivesIsTest: true,
            preferences: getPreferencesMock({
              ShoppingGives: {
                enableShoppingGives: true,
                storeIdShoppingGives: '',
                urlforShoppingGives:
                  'https://cdn.staging1.shoppinggives.com/cc-utilities/sgloader.js',
              },
            }),
          },
        },
      },
    })
    expect(
      baseElement.querySelector(`script[src="${src}"][data-nscript="${DATA_NCSRIPT}"]`)
    ).toBeNull()
  })
})
