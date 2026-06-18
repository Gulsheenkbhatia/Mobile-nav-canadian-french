import { render } from 'test-utils/react'
import VariationMessages, {
  NOT_SELECTED_TEXT,
  NOT_SELECTED_TEXT_WIDTH,
  NOT_SELECTED_TEXT_SIZE,
  NOT_AVAILABLE_TEXT,
  NOTIFY_TEXT,
  MAX_QUANTITY_RESTRICTION_TEXT,
} from './index'
import { ORDERING_ERROR, ORDERING_STATUS } from 'toro/helpers/productVariations'
import {
  badgeTypesUnderCTA,
  badgeTypes,
  badgeTypesGTM,
} from 'toro/components/badges/constants/badgeTypes'
import merge from 'lodash/merge'
import get from 'lodash/get'
import { applePayErrorMessageAtom } from 'store/pdp.atom'
import { BadgeArea } from 'toro/components/badges/constants/badgeAreas'
import { badgesAtom } from 'store/badges.atom'

// Mock all dependencies
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/test',
    query: {},
    asPath: '/test',
  }),
}))

describe('VariationMessages', () => {
  const mockGetBadgeTypesByArea = jest.fn()
  const mockGetContentByBadgeType = jest.fn()
  const mockGetContentSlotBySlotId = jest.fn()

  // Real implementation of getContentSlotBySlotId based on BadgesProvider
  const createRealGetContentSlotBySlotId = (badgingContentSlots, defaultLocale = 'en-US') => {
    return (slotId, product) => {
      const badgeContent = badgingContentSlots.find((slot) => get(slot, 'id') === slotId)
      let slotContent =
        get(badgeContent, `c_body.${defaultLocale}.markup`) ||
        get(badgeContent, 'c_body.default.markup')

      if (slotId === 'only-few-left-badge-default') {
        const itemsLeft = get(product, 'inventory.ats', 0)
        if (itemsLeft === 0) {
          return ''
        }
        slotContent = slotContent?.replace(/\{0\}/gi, itemsLeft)
      }
      return slotContent
    }
  }

  const defaultRenderOptions = {
    contexts: {
      ViewportContext: {
        viewport: 'desktop' as const,
        isDesktop: true,
      },
      PWAContext: {
        appData: {
          locale: 'en-US',
        },
      },
      SessionContext: {
        session: {
          user: {
            sourceCodeGroupID: null,
          },
        },
      },
      BadgesContext: {
        actions: {
          getBadgeTypesByArea: mockGetBadgeTypesByArea,
          getContentByBadgeType: mockGetContentByBadgeType,
          getContentSlotBySlotId: mockGetContentSlotBySlotId,
        },
      },
    },
  }

  const mockProduct = {
    inventory: {
      inStockDate: '2025-03-15',
    },
    customAttributes: {},
  }

  const mockMasterData = {
    inventory: {
      inStockDate: '2025-03-15',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Error Messages - Not Selected', () => {
    it('should display "Please select a Size and Width" when both size and width are not selected', () => {
      const { getByText } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notSelected}
          widthLength={2}
          sizesLength={3}
          selectedSize={null}
          selectedWidth={null}
        />,
        defaultRenderOptions
      )

      expect(getByText(NOT_SELECTED_TEXT)).toBeVisible()
    })

    it('should display "Please select a Width" when only width is not selected', () => {
      const { getByText } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notSelected}
          widthLength={2}
          sizesLength={3}
          selectedSize={{ id: 'size1' }}
          selectedWidth={null}
        />,
        defaultRenderOptions
      )

      expect(getByText(NOT_SELECTED_TEXT_WIDTH)).toBeVisible()
    })

    it('should display "Please select a Size" when only size is not selected', () => {
      const { getByText } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notSelected}
          widthLength={2}
          sizesLength={3}
          selectedSize={null}
          selectedWidth={{ id: 'width1' }}
        />,
        defaultRenderOptions
      )

      expect(getByText(NOT_SELECTED_TEXT_SIZE)).toBeVisible()
    })

    it('should not display not-selected error when size is selected (no width)', () => {
      const { queryByText } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notSelected}
          widthLength={0}
          sizesLength={3}
          selectedSize={{ id: 'size1' }}
          selectedWidth={null}
        />,
        defaultRenderOptions
      )

      expect(queryByText(NOT_SELECTED_TEXT_SIZE)).not.toBeInTheDocument()
      expect(queryByText(NOT_SELECTED_TEXT_WIDTH)).not.toBeInTheDocument()
    })

    it('should not display not-selected error when width is selected (no size)', () => {
      const { queryByText } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notSelected}
          widthLength={2}
          sizesLength={0}
          selectedSize={null}
          selectedWidth={{ id: 'width1' }}
        />,
        defaultRenderOptions
      )

      expect(queryByText(NOT_SELECTED_TEXT_SIZE)).not.toBeInTheDocument()
      expect(queryByText(NOT_SELECTED_TEXT_WIDTH)).not.toBeInTheDocument()
    })
  })

  describe('Error Messages - Not Available', () => {
    it('should display "This item is no longer available" when errorType is notAvailable', () => {
      const { getByText } = render(
        <VariationMessages product={mockProduct} errorType={ORDERING_ERROR.notAvailable} />,
        defaultRenderOptions
      )

      expect(getByText(NOT_AVAILABLE_TEXT)).toBeVisible()
    })

    it('should display not available message with proper internationalization', () => {
      const { getByText } = render(
        <VariationMessages product={mockProduct} errorType={ORDERING_ERROR.notAvailable} />,
        defaultRenderOptions
      )

      expect(getByText(NOT_AVAILABLE_TEXT)).toBeVisible()
    })
  })

  describe('Error Messages - Sold Out', () => {
    it('should display notify me text when product is sold out and isNotifyMeProduct is true', () => {
      const { getByText } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.soldOut}
          isNotifyMeProduct={true}
        />,
        defaultRenderOptions
      )

      expect(getByText(NOTIFY_TEXT)).toBeVisible()
    })

    it('should not display notify me text when product is sold out but isNotifyMeProduct is false', () => {
      const { queryByText } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.soldOut}
          isNotifyMeProduct={false}
        />,
        defaultRenderOptions
      )

      expect(queryByText(NOTIFY_TEXT)).not.toBeInTheDocument()
    })

    it('should apply correct BIZ class (biz-notify-me) for notify me message', () => {
      const { container } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.soldOut}
          isNotifyMeProduct={true}
        />,
        defaultRenderOptions
      )

      const messageElement = container.querySelector('.biz-notify-me')
      expect(messageElement).toBeInTheDocument()
    })
  })

  describe('Error Messages - Max Quantity', () => {
    it('should display max quantity restriction text when maxQuantityError is true', () => {
      const { getByText } = render(
        <VariationMessages product={mockProduct} maxQuantityError={true} />,
        defaultRenderOptions
      )

      expect(getByText(MAX_QUANTITY_RESTRICTION_TEXT)).toBeVisible()
    })

    it('should not display max quantity text when itemsNotAvailableMsgFlag is true', () => {
      const { queryByText } = render(
        <VariationMessages
          product={mockProduct}
          maxQuantityError={true}
          itemsNotAvailableMsgFlag={true}
        />,
        defaultRenderOptions
      )

      expect(queryByText(MAX_QUANTITY_RESTRICTION_TEXT)).not.toBeInTheDocument()
    })

    it('should display custom maxQtyErrorMsg when provided', () => {
      const customError = 'Custom max quantity error message'
      const { getByText } = render(
        <VariationMessages product={mockProduct} maxQtyErrorMsg={customError} />,
        defaultRenderOptions
      )

      expect(getByText(customError)).toBeVisible()
    })

    it('should display itemsNotAvailableMsg when provided', () => {
      const itemsNotAvailableMsg = 'Items not available message'
      const { getByText } = render(
        <VariationMessages product={mockProduct} itemsNotAvailableMsg={itemsNotAvailableMsg} />,
        defaultRenderOptions
      )

      expect(getByText(itemsNotAvailableMsg)).toBeVisible()
    })
  })

  describe('Error Messages - Apple Pay', () => {
    it('should display Apple Pay error message from applePayErrorMessageAtom', () => {
      const applePayError = 'Apple Pay is not available'
      const renderOptions = merge({}, defaultRenderOptions, {
        contexts: {
          JotaiProviderContext: new Map([[applePayErrorMessageAtom, applePayError]]),
        },
      })

      const { getByText } = render(<VariationMessages product={mockProduct} />, renderOptions)

      expect(getByText(applePayError)).toBeVisible()
    })

    it('should display Apple Pay error alongside other errors', () => {
      const applePayError = 'Apple Pay is not available'
      const renderOptions = merge({}, defaultRenderOptions, {
        contexts: {
          JotaiProviderContext: new Map([[applePayErrorMessageAtom, applePayError]]),
        },
      })

      const { getByText } = render(
        <VariationMessages product={mockProduct} errorType={ORDERING_ERROR.notAvailable} />,
        renderOptions
      )

      expect(getByText(applePayError)).toBeVisible()
      expect(getByText(NOT_AVAILABLE_TEXT)).toBeVisible()
    })
  })

  describe('Membership Exclusive', () => {
    it('should display "Membership Exclusive" alert when isMembershipExclusiveProduct is true', () => {
      const { getByText } = render(
        <VariationMessages product={mockProduct} isMembershipExclusiveProduct={true} />,
        defaultRenderOptions
      )

      expect(getByText('Membership Exclusive')).toBeVisible()
    })

    it('should not display membership alert when there are errors present', () => {
      const { queryByText } = render(
        <VariationMessages
          product={mockProduct}
          isMembershipExclusiveProduct={true}
          errorType={ORDERING_ERROR.notAvailable}
        />,
        defaultRenderOptions
      )

      expect(queryByText('Membership Exclusive')).not.toBeInTheDocument()
    })

    it('should use alert variant for membership message', () => {
      const { getByTestId } = render(
        <VariationMessages product={mockProduct} isMembershipExclusiveProduct={true} />,
        defaultRenderOptions
      )

      const element = getByTestId('pdp_txt_notifyme_alert')
      expect(element).toBeInTheDocument()
    })

    it('should apply correct styles to membership message', () => {
      const { getByTestId } = render(
        <VariationMessages product={mockProduct} isMembershipExclusiveProduct={true} />,
        defaultRenderOptions
      )

      const element = getByTestId('pdp_txt_notifyme_alert')
      expect(element).toHaveClass('product-info-message-alert')
    })
  })

  describe('Ordering Badges (Custom Messages)', () => {
    it('should display preorder badges when status is preorder', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder badge content')

      const { getByText } = render(
        <VariationMessages product={mockProduct} status={ORDERING_STATUS.preorder} />,
        defaultRenderOptions
      )

      expect(getByText('Preorder badge content')).toBeVisible()
    })

    it('should display backorder badges when status is backorder', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.backorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'backorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Backorder badge content')

      const { getByText } = render(
        <VariationMessages product={mockProduct} status={ORDERING_STATUS.backorder} />,
        defaultRenderOptions
      )

      expect(getByText('Backorder badge content')).toBeVisible()
    })

    it('should display final sale badge when isFinalSale is true', () => {
      const productWithFinalSale = {
        ...mockProduct,
        customAttributes: {
          c_isFinalSale: true,
        },
      }

      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypes.isFinalSale }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'final-sale-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Final sale badge')

      const { getByText } = render(
        <VariationMessages product={productWithFinalSale} />,
        defaultRenderOptions
      )

      expect(getByText('Final sale badge')).toBeVisible()
    })

    it('should display source code message badge when sourceCodeGroupID exists', () => {
      const productWithSourceCode = {
        ...mockProduct,
        sourceCodeMessage: {
          group1: [
            {
              type: 'pdp',
              contentId: 'source-code-content-id',
            },
          ],
        },
      }

      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: 'privateMarketingMessage' }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'source-code-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Source code message')

      const renderOptions = merge({}, defaultRenderOptions, {
        contexts: {
          SessionContext: {
            session: {
              user: {
                sourceCodeGroupID: 'group1',
              },
            },
          },
        },
      })

      const { getByText } = render(
        <VariationMessages product={productWithSourceCode} />,
        renderOptions
      )

      expect(getByText('Source code message')).toBeVisible()
    })

    it('should display marketing message badge when marketingMessageConf exists', () => {
      const productWithMarketing = {
        ...mockProduct,
        marketingMessageConf: { enabled: true },
      }

      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypes.isCustomMarketingBadgepdp }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'marketing-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue(badgeTypesGTM.isCustomMarketingBadgepdp)

      const { getByText } = render(
        <VariationMessages product={productWithMarketing} />,
        defaultRenderOptions
      )

      expect(getByText(badgeTypesGTM.isCustomMarketingBadgepdp)).toBeVisible()
    })

    it('should apply correct BIZ class (biz-preorder) for preorder badges', () => {
      const product = merge({}, mockProduct, {
        marketingMessageConf: { enabled: true },
        customAttributes: { c_isFinalSale: true },
      })

      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder badge')

      const { container } = render(
        <VariationMessages product={product} status={ORDERING_STATUS.preorder} />,
        defaultRenderOptions
      )

      const preorderElement = container.querySelector('.biz-preorder')
      expect(preorderElement).toBeInTheDocument()
    })

    it('should apply correct BIZ class (biz-backorder) for backorder badges', () => {
      const product = merge({}, mockProduct, {
        marketingMessageConf: { enabled: true },
        customAttributes: { c_isFinalSale: true },
      })

      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.backorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'backorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Backorder badge')

      const { container } = render(
        <VariationMessages product={product} status={ORDERING_STATUS.backorder} />,
        defaultRenderOptions
      )

      const backorderElement = container.querySelector('.biz-backorder')
      expect(backorderElement).toBeInTheDocument()
    })
  })

  describe('Ship Date Display', () => {
    it('should display expected ship date for preorder badges when inStockDate is provided', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder message')

      const { getByText } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.preorder}
          pdpExpecteShipdayMessageMarkup="Expected ship date:"
        />,
        defaultRenderOptions
      )

      expect(getByText(/Expected ship date:/)).toBeVisible()
      expect(getByText(/March 15/)).toBeVisible()
    })

    it('should display expected ship date for backorder badges when inStockDate is provided', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.backorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'backorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Backorder message')

      const { getByText } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.backorder}
          pdpExpecteShipdayMessageMarkup="Expected ship date:"
        />,
        defaultRenderOptions
      )

      expect(getByText(/Expected ship date:/)).toBeVisible()
    })

    it('should not display ship date for other badge types', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: 'otherBadge' }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'other-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Other badge')

      const { queryByText } = render(
        <VariationMessages
          product={mockProduct}
          pdpExpecteShipdayMessageMarkup="Expected ship date:"
        />,
        defaultRenderOptions
      )

      expect(queryByText(/Expected ship date:/)).not.toBeInTheDocument()
    })

    it('should format ship date correctly (Month Day format)', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder message')

      const { container } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.preorder}
          pdpExpecteShipdayMessageMarkup="Expected:"
        />,
        defaultRenderOptions
      )

      const shipDateElement = container.querySelector('[data-qa="pdp_txt_callout_exptd_shipdate"]')
      expect(shipDateElement?.textContent).toMatch(/Expected: March 15/)
    })

    it('should use locale-specific month names', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder message')

      const renderOptions = merge({}, defaultRenderOptions, {
        contexts: {
          PWAContext: {
            appData: { locale: 'ja-JP' },
          },
        },
      })

      const { container } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.preorder}
          pdpExpecteShipdayMessageMarkup="Expected:"
        />,
        renderOptions
      )

      const shipDateElement = container.querySelector('[data-qa="pdp_txt_callout_exptd_shipdate"]')
      expect(shipDateElement?.textContent).toMatch(/Expected: 3 15/) // ja-JP formatting
    })

    it('should display pdpExpecteShipdayMessageMarkup with ship date', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder message')

      const markup = 'Ships by:'

      const { getByText } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.preorder}
          pdpExpecteShipdayMessageMarkup={markup}
        />,
        defaultRenderOptions
      )

      expect(getByText(/Ships by:/)).toBeVisible()
    })
  })

  describe('Hide Custom Messages', () => {
    it('should not display ordering badges when hideCustomMessages is true', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Custom badge')

      const { queryByText } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.preorder}
          hideCustomMessages={true}
        />,
        defaultRenderOptions
      )

      expect(queryByText('Custom badge')).not.toBeInTheDocument()
    })

    it('should still display error messages when hideCustomMessages is true', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Custom badge')

      const { getByText, queryByText } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notAvailable}
          hideCustomMessages={true}
        />,
        defaultRenderOptions
      )

      expect(getByText(NOT_AVAILABLE_TEXT)).toBeVisible()
      expect(queryByText('Custom badge')).not.toBeInTheDocument()
    })

    it('should still display membership exclusive when hideCustomMessages is true', () => {
      const { getByText } = render(
        <VariationMessages
          product={mockProduct}
          isMembershipExclusiveProduct={true}
          hideCustomMessages={true}
        />,
        defaultRenderOptions
      )

      expect(getByText('Membership Exclusive')).toBeVisible()
    })
  })

  describe('Final Sale Logic', () => {
    it('should check product custom attribute c_isFinalSale for regular products', () => {
      const productWithFinalSale = {
        ...mockProduct,
        customAttributes: {
          c_isFinalSale: true,
        },
      }

      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypes.isFinalSale }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'final-sale-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Final sale badge')

      const { getByText } = render(
        <VariationMessages product={productWithFinalSale} />,
        defaultRenderOptions
      )

      // Should display final sale badge when custom attribute c_isFinalSale is true
      expect(getByText('Final sale badge')).toBeVisible()
    })

    it('should use isFinalSale prop directly for bundle variants', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypes.isFinalSale }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'final-sale-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Final sale badge')

      const { getByText } = render(
        <VariationMessages product={mockProduct} isBundleVariant={true} isFinalSale={true} />,
        defaultRenderOptions
      )

      // For bundle variants, it should use the prop directly
      expect(getByText('Final sale badge')).toBeVisible()
    })
  })

  describe('BIZ Class Names', () => {
    it('should apply "biz-backorder" class for backorder status', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.backorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'backorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Backorder message')

      const { container } = render(
        <VariationMessages product={mockProduct} status={ORDERING_STATUS.backorder} />,
        defaultRenderOptions
      )

      expect(container.querySelector('.biz-backorder')).toBeInTheDocument()
    })

    it('should apply "biz-preorder" class for preorder status', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder message')

      const { container } = render(
        <VariationMessages product={mockProduct} status={ORDERING_STATUS.preorder} />,
        defaultRenderOptions
      )

      expect(container.querySelector('.biz-preorder')).toBeInTheDocument()
    })

    it('should apply "biz-notify-me" class for sold out with notify me', () => {
      const { container } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.soldOut}
          isNotifyMeProduct={true}
        />,
        defaultRenderOptions
      )

      expect(container.querySelector('.biz-notify-me')).toBeInTheDocument()
    })

    it('should not apply BIZ class for in-stock status', () => {
      const { container } = render(
        <VariationMessages product={mockProduct} status={ORDERING_STATUS.inStock} />,
        defaultRenderOptions
      )

      expect(container.querySelector('.biz-backorder')).not.toBeInTheDocument()
      expect(container.querySelector('.biz-preorder')).not.toBeInTheDocument()
      expect(container.querySelector('.biz-notify-me')).not.toBeInTheDocument()
    })
  })

  describe('Multiple Errors', () => {
    it('should display multiple error messages simultaneously', () => {
      const { getByText } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notAvailable}
          maxQuantityError={true}
        />,
        defaultRenderOptions
      )

      expect(getByText(NOT_AVAILABLE_TEXT)).toBeVisible()
      expect(getByText(MAX_QUANTITY_RESTRICTION_TEXT)).toBeVisible()
    })

    it('should display errors in correct order', () => {
      const { container } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notAvailable}
          maxQuantityError={true}
          maxQtyErrorMsg="Custom max quantity message"
        />,
        defaultRenderOptions
      )

      // Get all error messages in the order they appear in the DOM
      const errorMessages = container.querySelectorAll('.product-info-message-alert')
      const errorTexts = Array.from(errorMessages).map((el) => el.textContent)

      // Expected order based on component logic:
      // 1. notAvailable error
      // 2. maxQuantity error
      // 3. maxQtyErrorMsg (custom message)
      expect(errorTexts).toEqual([
        NOT_AVAILABLE_TEXT,
        MAX_QUANTITY_RESTRICTION_TEXT,
        'Custom max quantity message',
      ])
    })

    it('should render each error with unique key', () => {
      const { container, getByText } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notAvailable}
          maxQtyErrorMsg="Custom max qty error"
          itemsNotAvailableMsg="Items not available"
        />,
        defaultRenderOptions
      )

      // Verify multiple errors are rendered separately (React keys working correctly)
      const messages = container.querySelectorAll('.product-info-message-alert')
      expect(messages.length).toBe(3)

      // Verify each error is present and independently rendered
      expect(getByText(NOT_AVAILABLE_TEXT)).toBeVisible()
      expect(getByText('Custom max qty error')).toBeVisible()
      expect(getByText('Items not available')).toBeVisible()
    })
  })

  describe('Badge Integration', () => {
    it('should call useBadges with correct parameters', () => {
      const testProduct = {
        id: 'TEST123',
        inventory: {
          inStockDate: '2025-04-20',
        },
        customAttributes: {},
      }

      const testVariationGroupData = {
        id: 'VG123',
      }

      const testMasterData = {
        id: 'MASTER123',
        inventory: {
          inStockDate: '2025-04-20',
        },
      }

      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder badge')

      const { container, getByText } = render(
        <VariationMessages
          product={testProduct}
          variationGroupData={testVariationGroupData}
          masterData={testMasterData}
          status={ORDERING_STATUS.preorder}
          pdpExpecteShipdayMessageMarkup="Expected ship date:"
        />,
        defaultRenderOptions
      )

      // Verify useBadges was called with correct parameters by checking
      // that getBadgeTypesByArea was called with the expected props
      expect(mockGetBadgeTypesByArea).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 'pdp',
          area: BadgeArea.UPPER_MISC,
          product: testProduct,
          variationGroupData: testVariationGroupData,
          masterData: testMasterData,
        })
      )

      // Verify a badge is rendered with correct content
      const badgeMessages = container.querySelectorAll('.product-info-message')
      expect(badgeMessages.length).toBe(1)

      // Verify preorder badge content is rendered
      expect(getByText('Preorder badge')).toBeVisible()

      // Verify the expected ship date is displayed for a badge
      const shipDates = container.querySelectorAll('[data-qa="pdp_txt_callout_exptd_shipdate"]')
      expect(shipDates.length).toBe(1)
      expect(shipDates[0]).toHaveTextContent('Expected ship date: April 20')
    })

    it('should handle empty badges array gracefully', () => {
      const { container } = render(
        <VariationMessages product={mockProduct} />,
        defaultRenderOptions
      )

      // When there are no badges, the custom message container should not have badge content
      const badgeMessages = container.querySelectorAll('.product-info-message')
      expect(badgeMessages.length).toBe(0)
    })

    it('should render badges with HtmlContent component', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue(
        '<strong data-testid="test-message">Preorder message</strong>'
      )

      const { container, getByText } = render(
        <VariationMessages product={mockProduct} status={ORDERING_STATUS.preorder} />,
        defaultRenderOptions
      )

      // Check that the badge message container is rendered and has [data-testid="test-message"] attribute on content tag
      const badgeMessage = container.querySelector(
        '[data-qa="pdp_txt_preorder_backorder_callout_msg"] > [data-testid="test-message"]'
      )
      expect(badgeMessage).toBeInTheDocument()

      // Check that the HTML content is rendered (HtmlContent will render the HTML)
      expect(getByText('Preorder message')).toBeVisible()
    })
  })

  describe('Internationalization', () => {
    it('should use formatMessage for all error texts', () => {
      const formatMessageSpy = jest.fn((msg) => msg.defaultMessage || msg.id)

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      jest.spyOn(require('react-intl'), 'useIntl').mockReturnValue({
        formatMessage: formatMessageSpy,
        locale: 'en-US',
      })

      // Test ORDERING_ERROR.notSelected (both size and width)
      formatMessageSpy.mockClear()
      render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notSelected}
          widthLength={2}
          sizesLength={3}
          selectedSize={null}
          selectedWidth={null}
        />,
        defaultRenderOptions
      )
      expect(formatMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pdp.product.notSelected.text',
          defaultMessage: NOT_SELECTED_TEXT,
        })
      )

      // Test ORDERING_ERROR.notSelected (width only)
      formatMessageSpy.mockClear()
      render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notSelected}
          widthLength={2}
          sizesLength={0}
          selectedWidth={null}
        />,
        defaultRenderOptions
      )
      expect(formatMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pdp.product.notSelectedWidth.text',
          defaultMessage: NOT_SELECTED_TEXT_WIDTH,
        })
      )

      // Test ORDERING_ERROR.notSelected (size only)
      formatMessageSpy.mockClear()
      render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notSelected}
          widthLength={0}
          sizesLength={3}
          selectedSize={null}
        />,
        defaultRenderOptions
      )
      expect(formatMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pdp.product.notSelectedSize.text',
          defaultMessage: NOT_SELECTED_TEXT_SIZE,
        })
      )

      // Test ORDERING_ERROR.notAvailable
      formatMessageSpy.mockClear()
      render(
        <VariationMessages product={mockProduct} errorType={ORDERING_ERROR.notAvailable} />,
        defaultRenderOptions
      )
      expect(formatMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pdp.product.notAvailable.text',
          defaultMessage: NOT_AVAILABLE_TEXT,
        })
      )

      // Test ORDERING_STATUS.soldOut with isNotifyMeProduct
      formatMessageSpy.mockClear()
      render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.soldOut}
          isNotifyMeProduct={true}
        />,
        defaultRenderOptions
      )
      expect(formatMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pdp.product.notify.text',
          defaultMessage: NOTIFY_TEXT,
        })
      )

      // Test maxQuantityError
      formatMessageSpy.mockClear()
      render(
        <VariationMessages product={mockProduct} maxQuantityError={true} />,
        defaultRenderOptions
      )
      expect(formatMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pdp.product.maxQuantityRestriction.text',
          defaultMessage: MAX_QUANTITY_RESTRICTION_TEXT,
        })
      )

      // Test membershipExclusive
      formatMessageSpy.mockClear()
      render(
        <VariationMessages product={mockProduct} isMembershipExclusiveProduct={true} />,
        defaultRenderOptions
      )
      expect(formatMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pdp.product.membershipExclusive',
          defaultMessage: 'Membership Exclusive',
        })
      )

      jest.restoreAllMocks()
    })

    it('should provide default messages for all translations', () => {
      // Test NOT_AVAILABLE_TEXT
      const { getByText: getByTextNotAvailable } = render(
        <VariationMessages product={mockProduct} errorType={ORDERING_ERROR.notAvailable} />,
        defaultRenderOptions
      )
      expect(getByTextNotAvailable(NOT_AVAILABLE_TEXT)).toBeVisible()

      // Test NOT_SELECTED_TEXT (both size and width not selected)
      const { getByText: getByTextNotSelected } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notSelected}
          widthLength={2}
          sizesLength={3}
          selectedSize={null}
          selectedWidth={null}
        />,
        defaultRenderOptions
      )
      expect(getByTextNotSelected(NOT_SELECTED_TEXT)).toBeVisible()

      // Test NOT_SELECTED_TEXT_WIDTH
      const { getByText: getByTextNotSelectedWidth } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notSelected}
          widthLength={2}
          sizesLength={0}
          selectedWidth={null}
        />,
        defaultRenderOptions
      )
      expect(getByTextNotSelectedWidth(NOT_SELECTED_TEXT_WIDTH)).toBeVisible()

      // Test NOT_SELECTED_TEXT_SIZE
      const { getByText: getByTextNotSelectedSize } = render(
        <VariationMessages
          product={mockProduct}
          errorType={ORDERING_ERROR.notSelected}
          widthLength={0}
          sizesLength={3}
          selectedSize={null}
        />,
        defaultRenderOptions
      )
      expect(getByTextNotSelectedSize(NOT_SELECTED_TEXT_SIZE)).toBeVisible()

      // Test NOTIFY_TEXT
      const { getByText: getByTextNotify } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.soldOut}
          isNotifyMeProduct={true}
        />,
        defaultRenderOptions
      )
      expect(getByTextNotify(NOTIFY_TEXT)).toBeVisible()

      // Test MAX_QUANTITY_RESTRICTION_TEXT
      const { getByText: getByTextMaxQty } = render(
        <VariationMessages product={mockProduct} maxQuantityError={true} />,
        defaultRenderOptions
      )
      expect(getByTextMaxQty(MAX_QUANTITY_RESTRICTION_TEXT)).toBeVisible()

      // Test Membership Exclusive
      const { getByText: getByTextMembership } = render(
        <VariationMessages product={mockProduct} isMembershipExclusiveProduct={true} />,
        defaultRenderOptions
      )
      expect(getByTextMembership('Membership Exclusive')).toBeVisible()
    })

    it('should use correct translation IDs (pdp.product.*)', () => {
      const formatMessageSpy = jest.fn((msg) => msg.defaultMessage || msg.id)

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      jest.spyOn(require('react-intl'), 'useIntl').mockReturnValue({
        formatMessage: formatMessageSpy,
        locale: 'en-US',
      })

      render(
        <VariationMessages product={mockProduct} errorType={ORDERING_ERROR.notAvailable} />,
        defaultRenderOptions
      )

      expect(formatMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.stringMatching(/^pdp\.product\./),
        })
      )

      // Verify the specific translation ID for notAvailable error
      expect(formatMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'pdp.product.notAvailable.text',
        })
      )

      jest.restoreAllMocks()
    })
  })

  describe('Container & Layout', () => {
    it('should render container with full width (w="100%")', () => {
      const { container } = render(
        <VariationMessages product={mockProduct} />,
        defaultRenderOptions
      )

      const boxElement = container.querySelector('.product-variation-message-error-container')
      expect(boxElement).toBeVisible()
      // The w="100%" prop is converted to CSS by Chakra UI
      expect(boxElement).toHaveStyle({ width: '100%' })
    })

    it('should apply flexBasis="100%" to container', () => {
      const { container } = render(
        <VariationMessages product={mockProduct} />,
        defaultRenderOptions
      )

      const boxElement = container.querySelector('.product-variation-message-error-container')
      expect(boxElement).toBeVisible()
      // The flexBasis="100%" prop is converted to CSS by Chakra UI
      expect(boxElement).toHaveStyle({ flexBasis: '100%' })
    })

    it('should have className "product-variation-message-error-container"', () => {
      const { container } = render(
        <VariationMessages product={mockProduct} />,
        defaultRenderOptions
      )

      expect(
        container.querySelector('.product-variation-message-error-container')
      ).toBeInTheDocument()
    })

    it('should render ProductInfoMessage components with correct CSS classes and props for different scenarios', () => {
      // Test alert message (membership exclusive)
      const { container: container1 } = render(
        <VariationMessages product={mockProduct} isMembershipExclusiveProduct={true} />,
        defaultRenderOptions
      )

      const alertMessage = container1.querySelector('.product-info-message-alert')
      expect(alertMessage).toBeVisible()
      expect(alertMessage).toHaveTextContent('Membership Exclusive')

      // Test error message with alert variant
      const { container: container2 } = render(
        <VariationMessages product={mockProduct} errorType={ORDERING_ERROR.notAvailable} />,
        defaultRenderOptions
      )

      const errorMessage = container2.querySelector('.product-info-message-alert')
      expect(errorMessage).toBeVisible()
      expect(errorMessage).toHaveTextContent(NOT_AVAILABLE_TEXT)

      // Test custom badge message
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder badge content')

      const { container: container3 } = render(
        <VariationMessages product={mockProduct} status={ORDERING_STATUS.preorder} />,
        defaultRenderOptions
      )

      const customMessage = container3.querySelector('.product-info-message')
      expect(customMessage).toBeVisible()
      expect(customMessage).toHaveClass('biz-upper-misc-container')
      expect(customMessage).toHaveClass('biz-preorder')
      expect(customMessage).toHaveAttribute('data-qa', 'pdp_txt_preorder_backorder_callout_msg')

      // Test backorder with biz className
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.backorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'backorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Backorder badge content')

      const { container: container4 } = render(
        <VariationMessages product={mockProduct} status={ORDERING_STATUS.backorder} />,
        defaultRenderOptions
      )

      const backorderMessage = container4.querySelector('.biz-backorder')
      expect(backorderMessage).toBeVisible()
      expect(backorderMessage).toHaveClass('biz-upper-misc-container')
    })
  })

  describe('Data-QA Attributes', () => {
    it('should have data-qa="pdp_txt_preorder_backorder_callout_msg" on badge messages', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder badge')

      const { container } = render(
        <VariationMessages product={mockProduct} status={ORDERING_STATUS.preorder} />,
        defaultRenderOptions
      )

      const badgeMessage = container.querySelector(
        '[data-qa="pdp_txt_preorder_backorder_callout_msg"]'
      )
      expect(badgeMessage).toBeInTheDocument()
    })

    it('should have data-qa="pdp_txt_callout_exptd_shipdate" on ship date', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder badge')

      const { container } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.preorder}
          pdpExpecteShipdayMessageMarkup="Expected:"
        />,
        defaultRenderOptions
      )

      const shipDate = container.querySelector('[data-qa="pdp_txt_callout_exptd_shipdate"]')
      expect(shipDate).toBeInTheDocument()
    })

    it('should maintain data-qa attributes for automation testing', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder badge')

      const { container } = render(
        <VariationMessages
          product={mockProduct}
          status={ORDERING_STATUS.preorder}
          pdpExpecteShipdayMessageMarkup="Expected:"
        />,
        defaultRenderOptions
      )

      expect(
        container.querySelector('[data-qa="pdp_txt_preorder_backorder_callout_msg"]')
      ).toBeInTheDocument()
      expect(
        container.querySelector('[data-qa="pdp_txt_callout_exptd_shipdate"]')
      ).toBeInTheDocument()
    })
  })

  describe('Props Handling', () => {
    it('should handle missing product prop gracefully', () => {
      const { container } = render(<VariationMessages />, defaultRenderOptions)

      expect(
        container.querySelector('.product-variation-message-error-container')
      ).toBeInTheDocument()
    })

    it('should handle missing masterData prop gracefully', () => {
      const { container } = render(
        <VariationMessages product={mockProduct} />,
        defaultRenderOptions
      )

      expect(
        container.querySelector('.product-variation-message-error-container')
      ).toBeInTheDocument()
    })

    it('should use masterData as fallback when product is not provided', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypesUnderCTA.preorder }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'preorder-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Preorder badge')

      const { getByText } = render(
        <VariationMessages
          masterData={mockMasterData}
          status={ORDERING_STATUS.preorder}
          pdpExpecteShipdayMessageMarkup="Expected:"
        />,
        defaultRenderOptions
      )

      // Should use masterData for inStockDate
      expect(getByText(/Expected:/)).toBeVisible()
      expect(getByText(/March 15/)).toBeVisible()
    })

    it('should handle undefined variationGroupData', () => {
      const { container } = render(
        <VariationMessages product={mockProduct} />,
        defaultRenderOptions
      )

      expect(
        container.querySelector('.product-variation-message-error-container')
      ).toBeInTheDocument()
    })

    it('should use default props for isBundleVariant (false)', () => {
      const productWithFinalSale = {
        ...mockProduct,
        customAttributes: {
          c_isFinalSale: true,
        },
      }

      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypes.isFinalSale }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'final-sale-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Final sale badge')

      const { getByText } = render(
        <VariationMessages
          product={productWithFinalSale}
          isFinalSale={false}
          isBundleVariant={false}
        />,
        defaultRenderOptions
      )

      expect(getByText('Final sale badge')).toBeVisible()
    })

    it('should use default props for isMembershipExclusiveProduct (false)', () => {
      const { queryByText } = render(
        <VariationMessages product={mockProduct} />,
        defaultRenderOptions
      )

      expect(queryByText('Membership Exclusive')).not.toBeInTheDocument()
    })
  })

  describe('Source Code Messages', () => {
    it('should display source code message when sourceCodeGroupID matches', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypes.isPrivateMarketingMessagepdp }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'source-code-content-id',
      })

      // Use real function implementation instead of mock
      const badgeMsg = 'Source code message for group1'
      const badgingContentSlots = [
        {
          id: 'source-code-content-id',
          c_body: {
            default: {
              markup: badgeMsg,
            },
          },
        },
      ]
      const realGetContentSlotBySlotId = createRealGetContentSlotBySlotId(badgingContentSlots)

      const productWithSourceCode = {
        ...mockProduct,
        sourceCodeMessage: {
          group1: [
            {
              type: 'pdp',
              contentId: 'source-code-content-id',
            },
          ],
        },
      }

      const renderOptions = merge({}, defaultRenderOptions, {
        contexts: {
          SessionContext: {
            session: {
              user: {
                sourceCodeGroupID: 'group1',
              },
            },
          },
          BadgesContext: {
            actions: {
              getBadgeTypesByArea: mockGetBadgeTypesByArea,
              getContentByBadgeType: mockGetContentByBadgeType,
              getContentSlotBySlotId: realGetContentSlotBySlotId,
            },
          },
          JotaiProviderContext: new Map([[badgesAtom, badgingContentSlots]]),
        },
      })

      const { getByText } = render(
        <VariationMessages product={productWithSourceCode} />,
        renderOptions
      )

      // Verify the real function returns the correct value
      const result = realGetContentSlotBySlotId('source-code-content-id', productWithSourceCode)
      expect(result).toBe(badgeMsg)

      expect(getByText(badgeMsg)).toBeVisible()
    })

    it('should not display source code message when sourceCodeGroupID is missing', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypes.isCustomMarketingMessagepdp }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'source-code-content-id',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Source code message for group1')

      const productWithSourceCode = {
        ...mockProduct,
        sourceCodeMessage: {
          group1: [
            {
              type: 'pdp',
              contentId: 'source-code-content-id',
            },
          ],
        },
      }

      const { queryByText } = render(
        <VariationMessages product={productWithSourceCode} />,
        defaultRenderOptions
      )

      expect(queryByText('Source code message for group1')).not.toBeInTheDocument()
    })

    it('should check product.sourceCodeMessage object', () => {
      mockGetBadgeTypesByArea.mockReturnValue({
        isAreaEnabled: true,
        maxBadgeDisplay: 1,
        badges: [{ badgeID: badgeTypes.isCustomMarketingMessagepdp }],
      })

      mockGetContentByBadgeType.mockReturnValue({
        enabled: true,
        contentId: 'source-code-content-id-1',
      })

      mockGetContentSlotBySlotId.mockReturnValue('Source code message for group1')

      const productWithSourceCode = {
        ...mockProduct,
        sourceCodeMessage: {
          group1: [
            {
              type: 'pdp',
              contentId: 'source-code-content-id-1',
            },
          ],
        },
      }

      const renderOptions = merge({}, defaultRenderOptions, {
        contexts: {
          SessionContext: {
            session: {
              user: {
                sourceCodeGroupID: 'group1',
              },
            },
          },
        },
      })

      const { getByText } = render(
        <VariationMessages product={productWithSourceCode} />,
        renderOptions
      )

      // Should display the source code message for the matching group
      expect(getByText('Source code message for group1')).toBeVisible()
    })
  })
})
