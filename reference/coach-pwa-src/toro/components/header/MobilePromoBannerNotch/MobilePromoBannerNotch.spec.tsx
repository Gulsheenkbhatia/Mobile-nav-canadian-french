import { screen } from '@testing-library/react'
import { configure } from '@testing-library/dom'
import MobilePromoBannerNotch from 'toro/components/header/MobilePromoBannerNotch/MobilePromoBannerNotch'
import { preferencesAtom } from 'store/preferences.atom'
import useAnalytics from 'toro/analytics/useAnalytics'
import { render } from 'test-utils/react'

configure({
  testIdAttribute: 'data-qa',
})
const mockPromoBanner = (() => {
  const headerPromoBanner = document.createElement('div')

  headerPromoBanner.innerHTML = `
    <div class="header-promo-banner">
      <ul class="splide__list">
        <li class="splide__slide"><a href="/view-all"><u>ORDER GIFTS</u> BY 12/18 FOR HOLIDAY DELIVERY.</a></li>
        <li class="splide__slide is-active"><a href="/smscapture">WANT <b>10% OFF</b> $150+? <u>GET YOUR CODE</u></a></li>
        <li class="splide__slide"><a href="/crossbody-bags">NEW IN. <u>SHOP HARLEY</u></a></li>
      </ul>
    </div>
  `
  return headerPromoBanner
})()

const mockEnableCollapsiblePromoBarPref = (value) => ({
  ToggleSiteFeatures: {
    enableCollapsiblePromoBar: value,
  },
})

const mockAnalytyticsSend = jest.fn()
jest.mock('toro/analytics/useAnalytics', () =>
  jest.fn(() => ({
    send: mockAnalytyticsSend,
  }))
)

jest.mock('store/preferences.atom', () => ({
  preferencesAtom: {
    read: jest.fn(),
  },
}))

jest.mock('toro/hooks/useMultiStyleConfig', () =>
  jest.fn(() => ({
    promoBannerNotch: () => {},
    promoBannerNotchLine: () => {},
  }))
)

describe('MobilePromoBannerNotch', () => {
  const setPromoBannerIsHidden = jest.fn()
  beforeEach(() => {
    ;(preferencesAtom.read as jest.Mock).mockReturnValueOnce(
      mockEnableCollapsiblePromoBarPref(true)
    )
  })
  it('renders with the "NavChevronDownIcon" when promoBannerIsHidden is true', () => {
    const promoBannerIsHidden = true

    render(
      <MobilePromoBannerNotch
        promoBannerIsHidden={promoBannerIsHidden}
        setPromoBannerIsHidden={setPromoBannerIsHidden}
        bannerRef={mockPromoBanner}
      />
    )
    const icon = document.getElementsByTagName('use')[0]
    expect(icon).toHaveAttribute('href', '#icon-nav-chevron-down')
  })

  it('renders with the "NavChevronUpIcon" when promoBannerIsHidden is false', async () => {
    const promoBannerIsHidden = false

    render(
      <MobilePromoBannerNotch
        promoBannerIsHidden={promoBannerIsHidden}
        setPromoBannerIsHidden={setPromoBannerIsHidden}
        bannerRef={mockPromoBanner}
      />
    )

    const icon = document.getElementsByTagName('use')[0]
    expect(icon).toHaveAttribute('href', '#icon-nav-chevron-up')
  })

  it('change promoBannerIsHidden from true to false when clicked', async () => {
    const promoBannerIsHidden = true
    const { user } = render(
      <MobilePromoBannerNotch
        promoBannerIsHidden={promoBannerIsHidden}
        setPromoBannerIsHidden={setPromoBannerIsHidden}
        bannerRef={mockPromoBanner}
      />
    )

    const button = screen.getByTestId('mb_btn_chevron_arrow')

    await user.click(button)

    expect(setPromoBannerIsHidden).toHaveBeenCalledTimes(1)
    expect(setPromoBannerIsHidden).toHaveBeenCalledWith(false)
  })

  it('change promoBannerIsHidden from false to true when clicked', async () => {
    const promoBannerIsHidden = false
    const { user } = render(
      <MobilePromoBannerNotch
        promoBannerIsHidden={promoBannerIsHidden}
        setPromoBannerIsHidden={setPromoBannerIsHidden}
        bannerRef={mockPromoBanner}
      />
    )
    const button = screen.getByTestId('mb_btn_chevron_arrow')

    await user.click(button)

    expect(setPromoBannerIsHidden).toHaveBeenCalledTimes(1)
    expect(setPromoBannerIsHidden).toHaveBeenCalledWith(true)
  })

  it('analytics should be sent with specific arguments', async () => {
    const promoBannerIsHidden = false
    const analytics = useAnalytics()
    const { user } = render(
      <MobilePromoBannerNotch
        promoBannerIsHidden={promoBannerIsHidden}
        setPromoBannerIsHidden={setPromoBannerIsHidden}
        bannerRef={mockPromoBanner}
      />
    )
    const button = screen.getByTestId('mb_btn_chevron_arrow')

    await user.click(button)

    expect(analytics.send).toHaveBeenCalledWith('mobilePromoBannerNotchInteraction', {
      eventAction: 'global banner close',
      eventLabel: 'WANT 10% OFF $150+? GET YOUR CODE',
    })
  })
})
