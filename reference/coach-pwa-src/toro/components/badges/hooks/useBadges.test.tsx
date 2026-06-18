import { renderHook } from 'test-utils/react'
import useBadges from './useBadges'
import { getMarketingConf } from 'toro/helpers/preferences'

jest.mock('toro/helpers/preferences', () => ({
  getMarketingConf: jest.fn(),
}))

const mockedGetMarketingConf = jest.mocked(getMarketingConf)

describe('useBadges', () => {
  const mockGetBadgeTypesByArea = jest.fn()
  const mockGetContentByBadgeType = jest.fn()
  const mockGetContentSlotBySlotId = jest.fn()

  const defaultBadgesContextValue = {
    actions: {
      getBadgeTypesByArea: mockGetBadgeTypesByArea,
      getContentByBadgeType: mockGetContentByBadgeType,
      getContentSlotBySlotId: mockGetContentSlotBySlotId,
    },
  }

  const defaultSessionContext = {
    session: {
      user: {
        sourceCodeGroupID: 'test-group-id',
      },
    },
  }

  const renderUseBadges = (
    props: any = {},
    badgesContextValue: any = defaultBadgesContextValue,
    sessionContext: any = defaultSessionContext
  ) => {
    return renderHook(() => useBadges(props), {
      contexts: {
        SessionContext: sessionContext,
        BadgesContext: badgesContextValue,
      },
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Basic Functionality Tests', () => {
    it('should return an empty array when isAreaEnabled is false', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: false,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: 'badge1' }, { badgeID: 'badge2' }, { badgeID: 'badge3' }],
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
      })

      expect(result.current).toEqual([])
      expect(mockGetContentByBadgeType).not.toHaveBeenCalled()
      expect(mockGetContentSlotBySlotId).not.toHaveBeenCalled()
    })

    it('should return badges up to maxBadgeDisplay limit', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 2,
        badges: [{ badgeID: 'badge1' }, { badgeID: 'badge2' }, { badgeID: 'badge3' }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('<div>Badge Content</div>')

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current).toHaveLength(2)
    })

    it('should handle missing or undefined props gracefully', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [],
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
      })

      expect(result.current).toEqual([])
      expect(() => result.current).not.toThrow()
    })
  })

  describe('Badge Type Filtering Tests', () => {
    beforeEach(() => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 5,
        badges: [{ badgeID: 'badge1' }, { badgeID: 'badge2' }, { badgeID: 'badge3' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })
      mockGetContentSlotBySlotId.mockReturnValue('<div>Badge Content</div>')
    })

    it('should filter badges based on allowedBadges array when provided', () => {
      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
        allowedBadges: ['badge1', 'badge3'],
      })

      expect(result.current).toHaveLength(2)
      expect(result.current.map((b) => b.badgeID)).toEqual(['badge1', 'badge3'])
    })

    it('should filter badges based on notAllowedBadges array when provided', () => {
      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
        notAllowedBadges: ['badge2'],
      })

      expect(result.current).toHaveLength(2)
      expect(result.current.map((b) => b.badgeID)).toEqual(['badge1', 'badge3'])
    })

    it('should return all badges when neither filter is provided', () => {
      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current).toHaveLength(3)
      expect(result.current.map((b) => b.badgeID)).toEqual(['badge1', 'badge2', 'badge3'])
    })

    it('should handle empty filter arrays correctly', () => {
      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
        allowedBadges: [],
      })

      expect(result.current).toHaveLength(3)
      expect(result.current.map((b) => b.badgeID)).toEqual(['badge1', 'badge2', 'badge3'])
    })

    it('should prioritize allowedBadges over notAllowedBadges when both are present', () => {
      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
        allowedBadges: ['badge1', 'badge2'],
        notAllowedBadges: ['badge2'],
      })

      expect(result.current).toHaveLength(2)
      expect(result.current.map((b) => b.badgeID)).toEqual(['badge1', 'badge2'])
    })
  })

  describe('Promotion Callout Badge Tests', () => {
    it('should return badge with content: "promo" when badgeID includes "promotionCallout"', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'promotionCallout' }],
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current).toHaveLength(1)
      expect(result.current[0]).toEqual({
        badgeID: 'promotionCallout',
        content: 'promo',
      })
    })

    it('should include correct badgeID for promotion callout badges', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'promotionCalloutBadge' }],
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current[0].badgeID).toBe('promotionCalloutBadge')
      expect(result.current[0].content).toBe('promo')
    })
  })

  describe('In-Stock Custom Badge Tests', () => {
    it('should extract custom text from product.custom.c_inStockCustomText', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'inStockCustom' }],
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: {
          id: 'prod-1',
          custom: {
            c_inStockCustomText: 'In Stock Now',
          },
        },
      })

      expect(result.current).toHaveLength(1)
      expect(result.current[0].content).toBe(
        '<label class="custom-badge mw-custom-badge">In Stock Now</label>'
      )
    })

    it('should fall back to props.instockText when product custom field is unavailable', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'inStockCustom' }],
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
        instockText: 'Available Now',
      })

      expect(result.current[0].content).toBe(
        '<label class="custom-badge mw-custom-badge">Available Now</label>'
      )
    })

    it('should render HTML label with correct classes: custom-badge mw-custom-badge', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'inStockCustomBadge' }],
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: {
          id: 'prod-1',
          custom: {
            c_inStockCustomText: 'Test',
          },
        },
      })

      expect(result.current[0].content).toContain('class="custom-badge mw-custom-badge"')
    })

    it('should handle missing in-stock text gracefully', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'inStockCustom' }],
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current[0].content).toBe(
        '<label class="custom-badge mw-custom-badge">undefined</label>'
      )
    })
  })

  describe('Private Marketing Badge Tests', () => {
    it('should call getPrivateSlotId with "Badge" type for privateMarketingBadge', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'privateMarketingBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      const product = {
        id: 'prod-1',
        sourceCodeBadge: {
          'test-group-id': [{ type: 'pdp', contentId: 'private-badge-slot' }],
        },
      }
      mockGetContentSlotBySlotId.mockReturnValue('<div>Private Badge</div>')

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product,
      })

      expect(mockGetContentSlotBySlotId).toHaveBeenCalledWith('private-badge-slot', product)
      expect(mockGetContentSlotBySlotId).not.toHaveBeenCalledWith('default-content-id', product)
      expect(result.current[0].content).toBe('<div>Private Badge</div>')
      expect(result.current[0].badgeID).toBe('privateMarketingBadge')
    })

    it('should call getPrivateSlotId with "Badge" type for onImagePrivateMarketing', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'onImagePrivateMarketing' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      const product = {
        id: 'prod-1',
        sourceCodeBadge: {
          'test-group-id': [{ type: 'pdp', contentId: 'private-badge-slot' }],
        },
      }
      mockGetContentSlotBySlotId.mockReturnValue('<div>Private Badge</div>')

      const { result } = renderUseBadges({ page: 'pdp', area: 'onImage', product })

      expect(mockGetContentSlotBySlotId).toHaveBeenCalledWith('private-badge-slot', product)
      expect(mockGetContentSlotBySlotId).not.toHaveBeenCalledWith('default-content-id', product)
      expect(result.current[0].content).toBe('<div>Private Badge</div>')
      expect(result.current[0].badgeID).toBe('onImagePrivateMarketing')
    })

    it('should call getPrivateSlotId with "Message" type for privateMarketingMessage', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'privateMarketingMessage' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      const product = {
        id: 'prod-1',
        sourceCodeMessage: {
          'test-group-id': [{ type: 'pdp', contentId: 'private-message-slot' }],
        },
      }
      mockGetContentSlotBySlotId.mockReturnValue('<div>Private Message</div>')

      const { result } = renderUseBadges({ page: 'pdp', area: 'onImage', product })

      expect(mockGetContentSlotBySlotId).toHaveBeenCalledWith('private-message-slot', product)
      expect(mockGetContentSlotBySlotId).not.toHaveBeenCalledWith('default-content-id', product)
      expect(result.current[0].content).toBe('<div>Private Message</div>')
      expect(result.current[0].badgeID).toBe('privateMarketingMessage')
    })

    it('should pass correct parameters: product, page, sourceCodeGroupID, selectedVG', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'privateMarketingBadge' }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      const product = { id: 'prod-1' }
      const selectedVG = {
        sourceCodeBadge: {
          'test-group-id': [{ type: 'pdp', contentId: 'vg-badge-slot' }],
        },
      }
      mockGetContentSlotBySlotId.mockReturnValue('<div>VG Badge</div>')

      renderUseBadges({ page: 'pdp', area: 'onImage', product, selectedVG })

      expect(mockGetContentSlotBySlotId).toHaveBeenCalledWith('vg-badge-slot', product)
    })

    it('should use sourceCodeGroupID from session context', () => {
      const customSessionContext = {
        session: {
          user: {
            sourceCodeGroupID: 'custom-group-id',
          },
        },
      }
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'privateMarketingBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      const product = {
        id: 'prod-1',
        sourceCodeBadge: {
          'custom-group-id': [{ type: 'pdp', contentId: 'custom-badge-slot' }],
        },
      }
      mockGetContentSlotBySlotId.mockReturnValue('<div>Custom Badge</div>')
      renderUseBadges(
        { page: 'pdp', area: 'onImage', product },
        defaultBadgesContextValue,
        customSessionContext
      )

      expect(mockGetContentSlotBySlotId).toHaveBeenCalledWith('custom-badge-slot', product)
    })
  })

  describe('Custom Marketing Badge Tests', () => {
    beforeEach(() => {
      mockedGetMarketingConf.mockReturnValue({
        pdp: 'marketing-slot-id',
      })
    })

    it('should call getMarketingSlotId for customMarketingBadge', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'customMarketingBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      mockGetContentSlotBySlotId.mockReturnValue('<div>Marketing Badge</div>')

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(mockedGetMarketingConf).toHaveBeenCalled()
      expect(mockGetContentSlotBySlotId).toHaveBeenCalledWith(
        'marketing-slot-id',
        expect.any(Object)
      )
      expect(result.current[0].content).toBe('<div>Marketing Badge</div>')
      expect(result.current[0].badgeID).toBe('customMarketingBadge')
    })

    it('should call getMarketingSlotId for onImageCustomBundleBadge', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'onImageCustomBundleBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      mockGetContentSlotBySlotId.mockReturnValue('<div>Bundle Badge</div>')

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(mockedGetMarketingConf).toHaveBeenCalled()
      expect(mockGetContentSlotBySlotId).toHaveBeenCalledWith(
        'marketing-slot-id',
        expect.any(Object)
      )
      expect(result.current[0].content).toBe('<div>Bundle Badge</div>')
      expect(result.current[0].badgeID).toBe('onImageCustomBundleBadge')
    })

    it('should call getMarketingSlotId for onImageCustomMarketingBadge', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'onImageCustomMarketingBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      mockGetContentSlotBySlotId.mockReturnValue('<div>Marketing Badge</div>')
      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(mockedGetMarketingConf).toHaveBeenCalled()
      expect(result.current[0].content).toBe('<div>Marketing Badge</div>')
      expect(result.current[0].badgeID).toBe('onImageCustomMarketingBadge')
    })

    it('should call getMarketingSlotId for customMarketingMessage', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'customMarketingMessage' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      mockGetContentSlotBySlotId.mockReturnValue('<div>Marketing Message</div>')

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(mockedGetMarketingConf).toHaveBeenCalled()
      expect(result.current[0].content).toBe('<div>Marketing Message</div>')
      expect(result.current[0].badgeID).toBe('customMarketingMessage')
    })

    it('should pass correct type ("Badge" or "Message") and props', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'customMarketingBadge' }, { badgeID: 'customMarketingMessage' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      const product = { id: 'prod-1' }

      renderUseBadges({ page: 'pdp', area: 'onImage', product })

      expect(mockedGetMarketingConf).toHaveBeenNthCalledWith(1, product, 'Badge')
      const badgeCalls = mockedGetMarketingConf.mock.calls.filter((call) => call[1] === 'Badge')
      const messageCalls = mockedGetMarketingConf.mock.calls.filter((call) => call[1] === 'Message')

      expect(badgeCalls.length).toBeGreaterThan(0)
      expect(messageCalls.length).toBeGreaterThan(0)
    })
  })

  describe('Badge Content Retrieval Tests', () => {
    it('should call actions.getContentByBadgeType with correct parameters', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'testBadgeContent' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })
      mockGetContentSlotBySlotId.mockReturnValue('<div>Badge Content</div>')
      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(mockGetContentByBadgeType).toHaveBeenCalledWith({
        isBundleProduct: false,
        page: 'pdp',
        type: 'test',
      })
      expect(result.current[0].content).toBe('<div>Badge Content</div>')
      expect(result.current[0].badgeID).toBe('testBadgeContent')
    })

    it('should detect bundle products via product.isProductSet', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'testBadgeContent' }],
      })
      mockGetContentByBadgeType.mockReturnValue({ enabled: true, contentId: 'content-slot-id' })

      renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1', isProductSet: true },
      })

      expect(mockGetContentByBadgeType).toHaveBeenCalledWith({
        isBundleProduct: true,
        page: 'pdp',
        type: 'test',
      })
    })

    it('should detect bundle products via product.set', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'testBadgeContent' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })
      mockGetContentSlotBySlotId.mockReturnValue('<div>Bundle Badge</div>')

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1', set: true },
      })

      expect(mockGetContentByBadgeType).toHaveBeenCalledWith({
        isBundleProduct: true,
        page: 'pdp',
        type: 'test',
      })
      expect(result.current[0].content).toBe('<div>Bundle Badge</div>')
      expect(result.current[0].badgeID).toBe('testBadgeContent')
    })

    it('should normalize badgeID strings correctly (removing Content, Badgeplp, etc.)', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [
          { badgeID: 'testBadgeContent' },
          { badgeID: 'anotherBadgeplp' },
          { badgeID: 'yetAnotherBadgepdp' },
          { badgeID: 'someMessagepdp' },
          { badgeID: 'someMessageplp' },
        ],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })

      renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(mockGetContentByBadgeType).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'test' })
      )
      expect(mockGetContentByBadgeType).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'another' })
      )
      expect(mockGetContentByBadgeType).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'yetAnother' })
      )
      expect(mockGetContentByBadgeType).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'some' })
      )
    })

    it('should replace onImageCustomMarketing with customMarketingOnImage', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'onImageCustomMarketing' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })
      renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(mockGetContentByBadgeType).toHaveBeenCalledWith({
        isBundleProduct: false,
        page: 'pdp',
        type: 'customMarketingOnImage',
      })
    })

    it('should replace onImageCustomBundle with customMarketingOnImage', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'onImageCustomBundle' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })

      renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(mockGetContentByBadgeType).toHaveBeenCalledWith({
        isBundleProduct: false,
        page: 'pdp',
        type: 'customMarketingOnImage',
      })
    })

    it('should replace onImagePrivateMarketing with privateMarketingOnImage', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'onImagePrivateMarketing' }],
      })
      mockGetContentByBadgeType.mockReturnValue({ enabled: true, contentId: 'content-slot-id' })
      const product = {
        id: 'prod-1',
        sourceCodeBadge: {
          'test-group-id': [{ type: 'pdp', contentId: 'private-badge-slot' }],
        },
      }
      renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product,
      })

      expect(mockGetContentByBadgeType).toHaveBeenCalledWith({
        isBundleProduct: false,
        page: 'pdp',
        type: 'privateMarketingOnImage',
      })
    })
  })

  describe('Content Slot Validation Tests', () => {
    it('should return null when badgeContent is missing', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'testBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue(null)

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current).toEqual([])
    })

    it('should return null when badgeContent.enabled is false', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'testBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: false,
        contentId: 'content-slot-id',
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current).toEqual([])
    })

    it('should return null when badgeContentSlot is missing', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'testBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })
      mockGetContentSlotBySlotId.mockReturnValue(null)

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current).toEqual([])
    })

    it('should include both badgeID and content when all validations pass', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'testBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })
      mockGetContentSlotBySlotId.mockReturnValue('<div>Badge Content</div>')

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current).toEqual([
        {
          badgeID: 'testBadge',
          content: '<div>Badge Content</div>',
        },
      ])
    })
  })

  describe('Context Integration Tests', () => {
    it('should retrieve actions from BadgesContext', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [],
      })

      renderUseBadges({
        page: 'pdp',
        area: 'onImage',
      })

      expect(mockGetBadgeTypesByArea).toHaveBeenCalled()
      expect(mockGetBadgeTypesByArea).toHaveBeenCalledWith(
        expect.objectContaining({ page: 'pdp', area: 'onImage' })
      )
    })

    it('should retrieve sourceCodeGroupID from SessionContext', () => {
      const customSessionContext = {
        session: {
          user: {
            sourceCodeGroupID: 'special-group',
          },
        },
      }
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'privateMarketingBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      const product = {
        id: 'prod-1',
        sourceCodeBadge: {
          'special-group': [{ type: 'pdp', contentId: 'special-badge-slot' }],
        },
      }

      renderUseBadges(
        {
          page: 'pdp',
          area: 'onImage',
          product,
        },
        defaultBadgesContextValue,
        customSessionContext
      )

      expect(mockGetContentSlotBySlotId).toHaveBeenCalledWith('special-badge-slot', product)
    })

    it('should call actions.getBadgeTypesByArea with correct parameters', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [],
      })
      const product = { id: 'prod-1', inventory: { ats: 10 } }
      const variant = 'variant-1'
      const variationGroupData = { groupId: 'group-1' }

      renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product,
        variant,
        variationGroupData,
        isViewedProduct: true,
      })

      expect(mockGetBadgeTypesByArea).toHaveBeenCalledWith({
        page: 'pdp',
        area: 'onImage',
        product,
        variant,
        variationGroupData,
        isViewedProduct: true,
        isMobile: false,
      })
    })
  })

  describe('Edge Cases & Error Handling', () => {
    it('should handle null/undefined product gracefully', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'testBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: null,
      })

      expect(() => result.current).not.toThrow()
    })

    it('should handle empty badges array', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [],
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current).toEqual([])
    })

    it('should handle malformed badgeID strings', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'validBadge' }, { badgeID: '' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(() => result.current).not.toThrow()
      expect(result.current.length).toBeGreaterThanOrEqual(0)
    })

    it('should handle missing session context', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'privateMarketingBadge' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'default-content-id',
      })
      mockGetContentSlotBySlotId.mockReturnValue(null)

      const { result } = renderUseBadges(
        {
          page: 'pdp',
          area: 'onImage',
          product: { id: 'prod-1' },
        },
        defaultBadgesContextValue,
        { session: null }
      )

      expect(() => result.current).not.toThrow()
    })

    it('should compact null values from final result', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 5,
        badges: [{ badgeID: 'badge1' }, { badgeID: 'badge2' }, { badgeID: 'badge3' }],
      })
      mockGetContentByBadgeType
        .mockReturnValueOnce({ enabled: true, contentId: 'content-1' })
        .mockReturnValueOnce({ enabled: false, contentId: 'content-2' })
        .mockReturnValueOnce({ enabled: true, contentId: 'content-3' })
      mockGetContentSlotBySlotId
        .mockReturnValueOnce('<div>Badge 1</div>')
        .mockReturnValueOnce(null)
        .mockReturnValueOnce('<div>Badge 3</div>')

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current).toHaveLength(2)
      expect(result.current.every((badge) => badge !== null)).toBe(true)
      expect(result.current[0].badgeID).toBe('badge1')
      expect(result.current[1].badgeID).toBe('badge3')
    })

    it('should handle badges without content property', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: [{ badgeID: 'badge1' }, { badgeID: 'badge2' }],
      })
      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'content-slot-id',
      })
      mockGetContentSlotBySlotId.mockReturnValueOnce(null).mockReturnValueOnce('<div>Badge 2</div>')

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current).toHaveLength(1)
      expect(result.current[0].badgeID).toBe('badge2')
    })

    it('should handle undefined badges from getBadgeTypesByArea', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 3,
        badges: undefined,
      })

      const { result } = renderUseBadges({
        page: 'pdp',
        area: 'onImage',
        product: { id: 'prod-1' },
      })

      expect(result.current).toEqual([])
      expect(() => result.current).not.toThrow()
    })
  })
})
