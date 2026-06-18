import { getPreferencesMock } from 'test-utils/mock-utils'
import { render } from 'test-utils/react'

const mockRecommendationComponentRender = jest.fn()
jest.mock('toro/components/Certona/Recommendation', () => (props) => {
  mockRecommendationComponentRender(props)
  return (
    <>
      {props?.certonaData?.items?.map?.((item) => (
        <div key={item.id}>{`Recommendation ${item.id}`}</div>
      ))}
    </>
  )
})
jest.mock('toro/components/Divider', () => () => 'Divider')
import MinicartRecommendations from 'toro/components/MinicartRecommendations'

const mockVariantId = 'QV657'

jest.mock('toro/hooks/useMinicartCertona', () => {
  return jest.fn((variantId) => {
    if (variantId === mockVariantId) {
      return {
        items: [{ id: 'YT987' }],
      }
    }
    return
  })
})

const defaultProps = {
  productData: {},
  siteId: 'coh_us_rt',
  onItemClick: jest.fn(),
}

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        preferences: getPreferencesMock({
          recommendations: {
            hideRecommendationPriceOnATC: 'hideYmalPriceATC',
          },
        }),
      },
    },
  },
}

const makeSetup = async (props, customRenderOptions) => {
  const component = <MinicartRecommendations {...defaultProps} {...props} />
  const result = render(component, customRenderOptions || renderOptions)
  return result
}

describe('MinicartRecommendations tests', () => {
  it('Should render devider when there is no any recommended products', async () => {
    const { getByText } = await makeSetup()
    getByText('Divider')
  })
  it('Should render CertonaRecommendations component with correct properties when there are products', async () => {
    const { findByText } = await makeSetup({ variantId: mockVariantId })
    await findByText('Recommendation YT987')

    expect(mockRecommendationComponentRender).toHaveBeenCalledWith({
      certonaData: {
        items: [{ id: 'YT987' }],
      },
      siteId: 'coh_us_rt',
      hidePrice: 'hideYmalPriceATC',
      label: 'Pair it with',
      type: 'yaml',
      loading: false,
      variant: 'minicart',
      sliderOptions: { perPage: 3, arrows: false },
      skeletonVisible: false,
      onItemClick: defaultProps.onItemClick,
    })
  })
})
