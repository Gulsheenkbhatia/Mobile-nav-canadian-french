import { render, screen } from 'test-utils/react'
import TabControls from 'toro/components/product/ProductVariationControls/NewMegaPDP/TabControls'

const componentProps = {
  tabList: [
    {
      tabId: 'lifecycle',
      selectedTab: {
        name: 'New',
      },
      name: 'New',
    },
  ],
  selectedTab: { name: 'New' },

  tabLabel: 'lifecycle',
  isSticky: false,
  selectedColor: null,
  productId: null,
  isPDPLoaded: false,
}

const componentPropsLongLabel = {
  tabList: [
    {
      tabId: 'lifecycle',
      selectedTab: {
        name: 'baseballfence',
      },
      name: 'baseballfence',
    },
  ],
  selectedTab: { name: 'baseballfence' },
  tabLabel: 'lifecycle',
  isPDPLoaded: true,
}

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})
jest.mock('toro/hooks/useViewportType', () => {
  return jest.fn(() => ({
    isDesktop: true,
  }))
})

const setup = (overrideProps = {}) => {
  return render(<TabControls {...componentProps} {...overrideProps} />, {
    contexts: { PWAContext: { appData: {} } },
  })
}

describe('Tab Label Check', () => {
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('Should Display Tab Attribute Label without error', () => {
    setup()

    const ProductVariationLabel = screen.getByText('lifecycle:')
    expect(ProductVariationLabel).toBeVisible()
  })

  it('Should Display Tab Attribute Label with text lifecycle', () => {
    setup(componentPropsLongLabel)

    const ProductVariationLabel = screen.getByText('lifecycle:')
    expect(ProductVariationLabel).toBeVisible()
  })
})
