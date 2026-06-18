import React from 'react'
import { render } from 'test-utils/react'
import Badges from './Badges'
import useBadges from 'toro/components/badges/hooks/useBadges'
import { badgeTypes } from 'toro/components/badges/constants/badgeTypes'

const mockBadges = [
  {
    badgeID: '1',
    content: 'badge1',
  },
  { badgeID: '2', content: 'promo' },
  { badgeID: badgeTypes.isSoldOut, content: 'badge2' },
]

jest.mock('toro/components/badges/hooks/useBadges', () => jest.fn(() => mockBadges))
jest.mock('toro/hooks/useExperiment', () => jest.fn())
jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({
      push,
    }),
  }
})

const renderComponent = (props) => {
  return render(<Badges {...props} />, {
    contexts: {
      PWAContext: { appData: {} },
      ViewportContext: { isDesktop: false, isMobile: true },
    },
  })
}
describe('Badges component', () => {
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('should not display any badges if there are no badges', () => {
    useBadges.mockReturnValueOnce(null)
    const { container } = renderComponent()
    const badges = container.querySelectorAll('.biz-inventory-status')
    expect(badges.length).toBe(0)
  })

  it('renders Badge components excluding promo content', () => {
    const { container } = renderComponent()
    const badges = container.querySelectorAll('.biz-inventory-status')
    expect(badges.length).toBe(2)
  })

  it('limits the number of displayed badges', () => {
    const { container } = renderComponent({ maxDisplayedBadges: 1 })
    const badges = container.querySelectorAll('.biz-inventory-status')
    expect(badges.length).toBe(1)
  })

  it('renders custom sold out text', () => {
    const customSoldOutText = 'Sold Out Custom'
    const product = {
      custom: { c_soldOutCustomText: customSoldOutText },
    }
    const { queryByText } = renderComponent({ product })
    expect(queryByText(customSoldOutText)).toBeInTheDocument()
  })

  it('renders custom sold out text from default variant', () => {
    const customSoldOutText = 'Sold Out Default'
    const product = {
      defaultVariant: { customAttributes: { c_soldOutCustomText: customSoldOutText } },
    }
    const { queryByText } = renderComponent({ product })
    expect(queryByText(customSoldOutText)).toBeInTheDocument()
  })
})
