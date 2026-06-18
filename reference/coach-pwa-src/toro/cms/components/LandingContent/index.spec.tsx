import { render, CustomRenderOptions } from 'test-utils/react'
import LandingContent from 'toro/cms/components/LandingContent/index'
import useViewportType from 'toro/hooks/useViewportType'
import { useAtomValue } from 'jotai/utils'
import menuDataAtom, { isOneCoachNAEnabledAtom, oneSiteActiveBrandAtom } from 'store/menu-data.atom'
import { addToBagButtonOnEventAtom, isFirstVisitAtom } from 'store/global.atom'
import usePreference from 'toro/hooks/usePreference_new'
import { mockIntersectionObserver } from 'test-utils/mock-utils'
import React from 'react'
import userEvent from '@testing-library/user-event'
import useAnalytics from 'toro/analytics/useAnalytics'
import { getStarSvg } from 'toro/helpers/home'
import useExperiment from 'toro/hooks/useExperiment'
import { xgenFeaturesAtom } from 'store/xgen-features.atom'
declare global {
  interface Window {
    $?: jest.Mock
  }
}

mockIntersectionObserver()

jest.mock('toro/hooks/useViewportType')
jest.mock('jotai/utils')
jest.mock('toro/hooks/usePreference_new')
jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/helpers/home')
jest.mock('toro/lib/xgen/client', () => {
  return jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    search: jest.fn(),
    getSortOptions: jest.fn(),
  }))
})
jest.mock('store/xgen-features.atom', () => ({
  xgenFeaturesAtom: {},
}))
jest.mock('toro/hooks/useExperiment')
jest.mocked(useExperiment).mockImplementation(() => false)

const mockSendAnalytics = jest.fn()
const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const mockedUseAtomValue = useAtomValue as jest.MockedFn<typeof useAtomValue>
const mockedUsePreference = usePreference as jest.MockedFn<typeof usePreference>
const mockedUseAnalytics = useAnalytics as jest.MockedFn<typeof useAnalytics>
const mockedGetStarSvg = getStarSvg as jest.MockedFn<typeof getStarSvg>

jest.mock('toro/components/UGC/UGCPortal', () => () => <div data-qa="ugc_portal">UGC Portal</div>)
jest.mock('toro/components/home/YoutubePlayer', () => () => (
  <div data-qa="youtube_player">YouTube Player</div>
))

jest.mock('toro/cms/components/LandingContent/LazySlot', () => {
  const actual = jest.requireActual('react')
  const React = actual
  const LazySlot = React.forwardRef((props, ref) => (
    <div ref={ref} data-qa="lazy_slot">
      <a data-qa="links" href="/category/bags" className="mini-nav__links">
        Hand Bags
      </a>
      <a data-qa="links" href="/category/shoes" className="mini-nav__links">
        Shoes
      </a>
      <div className="splide__slide--clone" data-pid="CG928-B3">
        <div className="atb-disabled" data-show-atb="true" data-atb-pid="CY919-B4">
          <button className="plpV2OrV3Atc" data-server-portal="true">
            Add to Bag
          </button>
        </div>
      </div>
      <button data-promotion-id="id-1108-insider-hp-banner" title="SIGN IN TO CUSTOMIZE">
        EXPLORE CUSTOMIZATION
      </button>
      <button data-countdown-endtime="2023-10-10T15:00:00.000Z">Button 1</button>
      <button className="mol-tabbed-content">Button 2</button>
    </div>
  ))
  return {
    __esModule: true,
    default: LazySlot,
  }
})
jest.mock('toro/components/CmsAddToBagButton', () => () => (
  <div data-qa="cms_add_to_bag_button">Add to Bag Button</div>
))
jest.mock('toro/components/CLPRecommendationsSlot', () => (props: { schema?: unknown }) => (
  <div data-qa="clp_recommendations_slot" data-schema={JSON.stringify(props.schema)} />
))
jest.mock('toro/components/RecommendationsTabbedContainer', () => (props: { type?: string }) => (
  <div data-qa="recommendations_tabbed_container" data-type={props.type} />
))

const defaultProps = {
  slots: [
    {
      id: 'home_hero_slot_1',
      html: '<div id="home_hero_slot_1"> </div>',
      isRecommendationsSlot: false,
      wyngSlot: false,
    },
    {
      id: 'doh-slot',
      html: '<div id="doh-slot"> </div>',
      isRecommendationsSlot: false,
      wyngSlot: false,
    },
    {
      id: 'dod-slot',
      html: '<div id="dod-slot"> </div>',
      isRecommendationsSlot: false,
      wyngSlot: false,
    },
    {
      id: 'home_body_slot_3',
      html: '<div id="home_body_slot_3"> <div id="certona-recommendations"></div> </div>',
      isRecommendationsSlot: true,
      wyngSlot: false,
    },
    {
      id: 'home_body_slot_wyng',
      html: '<div id="home_body_slot_wyng"> </div>',
      isRecommendationsSlot: false,
      wyngSlot: true,
    },
  ],
  videoSrcs: [
    { videoId: 'vid1', videoSrc: { desktop: 'desk1.mp4', mobile: 'mob1.mp4' } },
    { videoId: 'vid2', videoSrc: { desktop: 'desk2.mp4', mobile: 'mob2.mp4' } },
  ],
  isHome: true,
  children: false,
  slotsBottom: [],
}

const renderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        siteId: 'coh_us_rt',
        brand: 'coach',
      },
      injectJquery: jest.fn(),
    },
    SessionContext: {
      session: {
        user: {
          userEmail: 'ritesh622k@gmail.com',
        },
      },
    },
  },
}

const MENU_DATA = {
  clothing: {
    name: 'Hand Bags',
    url: '/category/bags',
    parentCategoryTree: ['Women', 'Apparel', 'Clothing'],
  },
  shoes: {
    name: 'Shoes',
    url: '/category/shoes',
    parentCategoryTree: ['Men', 'Footwear', 'Shoes'],
  },
}

const makeSetup = (props: any = {}) => {
  const combinedProps = { ...defaultProps, ...props }
  return render(<LandingContent {...combinedProps} />, renderOptions)
}
describe('LandingContent', () => {
  beforeEach(() => {
    const mockPanelButton = {
      parents: jest.fn(() => ({
        find: jest.fn(() => ({
          animate: jest.fn(),
        })),
      })),
    }
    const mockOn = jest.fn((_event, _selector, callback) => {
      const mockEvent = {
        preventDefault: jest.fn(),
        currentTarget: 'mock-target',
      }
      window.$ = jest.fn(() => mockPanelButton)
      callback(mockEvent)
    })
    const mockElement = {
      each: jest.fn((cb: any) => cb(0, mockElement)),
      find: jest.fn().mockReturnThis(),
      attr: jest.fn().mockImplementation((id: any) => {
        if (id === 'data-qa') return 'cm_icon_pt_rs_filled'
        if (id === 'class') return 'open expanded close'
        if (id === 'id') return 'vid1'
        return null
      }),
      prepend: jest.fn(),
      replaceWith: jest.fn((fn: () => any) => fn()),
      addClass: jest.fn(),
      closest: jest.fn(() => ({
        attr: jest.fn().mockImplementation((id: any) => {
          if (id === 'data-qa') return 'cm_icon_pt_rs_filled'
          if (id === 'class') return 'open expanded close'
          if (id === 'id') return 'vid1'
          return null
        }),
      })),
      includes: jest.fn(),
      on: mockOn,
    }
    const $mock = jest.fn(() => {
      return mockElement
    })
    window.$ = $mock
    mockedGetStarSvg.mockImplementation((id: any) => {
      if (id === 'cm_icon_pt_rs_filled') return '<use href="#icon-review-star-filled" />'
      if (id === 'cm_icon_pt_rs_blank') return '<use href="#icon-nav-chevron-blank" />'
      if (id === 'cm_icon_pt_rs_half') return '<use href="#icon-review-star-half" />'
      return null
    })
    mockedUseAnalytics.mockImplementation(() => ({
      send: mockSendAnalytics,
    }))
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: true, isMobile: false }))
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case xgenFeaturesAtom:
          return { recommendations: false }
        case menuDataAtom:
          return MENU_DATA
        case addToBagButtonOnEventAtom:
          return <div>Add to Bag Event</div>
        case isOneCoachNAEnabledAtom:
          return false
        case oneSiteActiveBrandAtom:
          return undefined
        default:
          return undefined
      }
    })
    mockedUsePreference.mockImplementation(() => ({
      certonaConfiguration: { certonaVisibility: true },
      pixleeUgc: { enablePixleeUGCHome: true },
      wyng: { isEnableWyngOnHomePage: true },
      adaptiveExperience: { matchingExperience: { recommender: 'home3_rr' } },
      recommendations: { hideRecommendations: false, disableRecommendationOnPages: [] },
    }))
  })

  afterEach(() => {
    delete window.$
    jest.clearAllMocks()
  })

  it('renders LandingContent component properly with default props', () => {
    const { getAllByTestId } = makeSetup()
    expect(getAllByTestId('lazy_slot')[0]).toBeVisible()
  })

  it('renders LandingContent component properly when slots html is empty', () => {
    const { queryByTestId } = makeSetup({
      slots: [
        {
          id: 'home_hero_slot_1',
          isRecommendationsSlot: false,
          wyngSlot: false,
        },
        {
          id: 'doh-slot',
          isRecommendationsSlot: false,
          wyngSlot: false,
        },
      ],
    })
    expect(queryByTestId('lazy_slot')).not.toBeInTheDocument()
  })

  it('renders LandingContent component properly when slot is empty', () => {
    const { queryByTestId } = makeSetup({
      slots: [],
    })
    expect(queryByTestId('lazy_slot')).not.toBeInTheDocument()
  })

  it('renders LandingContent component properly when isEnableWyngOnHomePage is falsy', () => {
    const original = mockedUsePreference()
    mockedUsePreference.mockImplementation(() => ({
      ...original,
      wyng: {
        ...original.wyng,
        isEnableWyngOnHomePage: false,
      },
    }))
    const { getAllByTestId } = makeSetup()
    expect(getAllByTestId('lazy_slot')[0]).toBeVisible()
  })

  it('renders LandingContent component properly when viewport changes to mobile', () => {
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, isMobile: true }))
    const { getAllByTestId } = makeSetup()
    expect(getAllByTestId('lazy_slot')[0]).toBeVisible()
  })

  it('renders LandingContent component properly when user clicks on nav links and analytics is sent', async () => {
    const user = userEvent.setup()
    const { getAllByTestId } = makeSetup()
    const target = getAllByTestId('links')[0]
    await user.click(target)
    expect(mockSendAnalytics).toHaveBeenCalled()
  })

  it('uses brand-specific matchingExperience when One Coach NA is enabled', () => {
    mockedUseViewportType.mockImplementation(() => ({ isDesktop: false, isMobile: true }))
    mockedUseAtomValue.mockImplementation((atom) => {
      switch (atom) {
        case isOneCoachNAEnabledAtom:
          return true
        case oneSiteActiveBrandAtom:
          return 'coach'
        case isFirstVisitAtom:
          return true
        case xgenFeaturesAtom:
          return { recommendations: false }
        case menuDataAtom:
          return MENU_DATA
        case addToBagButtonOnEventAtom:
          return <div>Add to Bag Event</div>
        default:
          return undefined
      }
    })
    mockedUsePreference.mockImplementation(() => ({
      certonaConfiguration: { certonaVisibility: true },
      pixleeUgc: { enablePixleeUGCHome: true },
      wyng: { isEnableWyngOnHomePage: true },
      coachtopia: { coachtopiaHomeURL: '/' },
      toggleSiteFeatures: { enableExpandedMinProductApi: false },
      adaptiveExperience: {
        matchingExperience: {
          coach: { recommender: 'sm_el_plp7' },
          outlet: { recommender: 'home3_rr' },
        },
      },
      recommendations: {
        hideRecommendations: false,
        disableRecommendationOnPages: [],
        disabledSchemes: [],
      },
    }))

    const { getByTestId } = makeSetup()
    expect(getByTestId('recommendations_tabbed_container')).toHaveAttribute(
      'data-type',
      'sm_el_plp7'
    )
  })

  it('renders CLPRecommendationsSlot when slot.clpRecommendations is enabled', async () => {
    const clpSchema = { id: 'clp-schema-1' }
    const { findByTestId, getAllByTestId } = makeSetup({
      slots: [
        ...defaultProps.slots,
        {
          html: '<div id="clp-recs-slot" />',
          clpRecommendations: { enabled: true, schema: clpSchema },
        },
      ],
    })

    expect(getAllByTestId('lazy_slot')[0]).toBeVisible()
    expect(await findByTestId('clp_recommendations_slot')).toHaveAttribute(
      'data-schema',
      JSON.stringify(clpSchema)
    )
  })

  it('does not render CLPRecommendationsSlot when slot.clpRecommendations is disabled', () => {
    const { queryByTestId } = makeSetup({
      slots: [
        {
          html: '<div id="clp-recs-slot" />',
          clpRecommendations: { enabled: false, schema: { id: 'clp-schema-2' } },
        },
      ],
    })

    expect(queryByTestId('clp_recommendations_slot')).not.toBeInTheDocument()
  })
})
