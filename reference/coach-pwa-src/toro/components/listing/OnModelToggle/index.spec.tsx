import { Atom } from 'jotai'
import { type CustomRenderOptions, render, waitFor, fireEvent } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import OnModelToggle from './index'
import useAnalytics from 'toro/analytics/useAnalytics'
import { onModelAtom, modelToggleViewAtom, ModelToggleView } from 'store/plp.atom'
import { isHeaderHeightAtom } from 'store/headroom.atom'

jest.mock('toro/analytics/useAnalytics')

const onModelAtomData = {
  onModelPlpSequence: [],
  isOnModelTabActive: false,
  isOnModelPLPToggleEnabled: false,
  isOnModel2UpToggleEnabled: false,
  showOnModel2Up: false,
}

const defaultAtomsData: Array<[Atom<unknown>, unknown]> = [
  [onModelAtom, onModelAtomData],
  [modelToggleViewAtom, ModelToggleView.Model],
]

const defaultRenderOptions: CustomRenderOptions = {
  contexts: {
    PWAContext: {
      appData: {
        siteId: 'coh_us_out',
        defaultLocale: 'en-US',
        locale: 'en-US',
      },
    },
  },
}

interface MakeSetupOptions {
  customRenderOptions?: CustomRenderOptions
  customProps?: React.ComponentProps<typeof OnModelToggle>
  customAtomsData?: Array<[Atom<unknown>, unknown]>
}

const makeSetup = ({
  customRenderOptions,
  customProps,
  customAtomsData = [],
}: MakeSetupOptions = {}) => {
  const renderOptions: CustomRenderOptions = {
    ...defaultRenderOptions,
    ...customRenderOptions,
    contexts: {
      ...defaultRenderOptions.contexts,
      ...customRenderOptions?.contexts,
      JotaiProviderContext: new Map([...defaultAtomsData, ...customAtomsData]),
    },
  }
  const props: React.ComponentProps<typeof OnModelToggle> = {
    isExposedOrFocusedFilteringEnabled: false,
    ...customProps,
  }

  return render(<OnModelToggle {...props} />, renderOptions)
}

describe('OnModelToggle', () => {
  const mockSend = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.mocked(useAnalytics).mockReturnValue({ send: mockSend })
  })

  describe('Conditional Rendering', () => {
    it('should render OnModelToggle component if isExposedOrFocusedFilteringEnabled is false', () => {
      const { getByTestId } = makeSetup()

      expect(getByTestId('onModelToggle')).toBeVisible()
    })

    it('should not render OnModelToggle component if isExposedOrFocusedFilteringEnabled is true and header is not visible', async () => {
      const { queryByTestId } = makeSetup({
        customProps: {
          isExposedOrFocusedFilteringEnabled: true,
        },
        customAtomsData: [[isHeaderHeightAtom, 100]],
      })

      fireEvent.scroll(window, { target: { scrollY: 101 } })

      await waitFor(() => {
        expect(queryByTestId('onModelToggle')).toBeNull()
      })
    })
  })

  describe('View Title Text', () => {
    it.each([
      ['Styled View', true],
      ['Model View', false],
    ])(
      'should render "%s" when isOnModel2UpToggleEnabled is %p',
      (expectedText, isOnModel2UpToggleEnabled) => {
        const { getByText } = makeSetup({
          customAtomsData: [[onModelAtom, { isOnModel2UpToggleEnabled }]],
        })

        expect(getByText(expectedText)).toBeVisible()
      }
    )
  })

  describe('Switch Toggle Functionality', () => {
    it('should toggle Model and Product View when switch is clicked', async () => {
      const { getByTestId } = makeSetup({
        customAtomsData: [
          [onModelAtom, { isOnModel2UpToggleEnabled: true }],
          [modelToggleViewAtom, ModelToggleView.Model],
        ],
        customProps: {
          isExposedOrFocusedFilteringEnabled: false,
        },
      })

      const toggleSwitch = getByTestId('onModelToggle')

      // Initially in Model View
      const hiddenInput = toggleSwitch.querySelector<HTMLInputElement>('input[type="checkbox"]')
      expect(hiddenInput).toBeChecked()

      // Switch to Product View
      await userEvent.click(toggleSwitch)
      const productViewHiddenInput =
        toggleSwitch.querySelector<HTMLInputElement>('input[type="checkbox"]')
      expect(productViewHiddenInput).not.toBeChecked()

      // Switch back to Model View
      await userEvent.click(toggleSwitch)
      const modelViewHiddenInput =
        toggleSwitch.querySelector<HTMLInputElement>('input[type="checkbox"]')
      expect(modelViewHiddenInput).toBeChecked()
    })
  })

  describe('Analytics Tracking', () => {
    const productViewAtomsData: Array<[Atom<unknown>, unknown]> = [
      [onModelAtom, { isOnModel2UpToggleEnabled: true }],
    ]

    const modelViewAtomsData: Array<[Atom<unknown>, unknown]> = [
      [onModelAtom, { isOnModel2UpToggleEnabled: true }],
      [modelToggleViewAtom, ModelToggleView.Product],
    ]

    it.each([
      {
        viewName: 'Product View',
        customAtomsData: productViewAtomsData,
        expectedLabel: 'product view',
      },
      {
        viewName: 'Model View',
        customAtomsData: modelViewAtomsData,
        expectedLabel: 'model view',
      },
    ])(
      'should send analytics event when toggling to $viewName',
      async ({ customAtomsData, expectedLabel }) => {
        const { getByTestId } = makeSetup({
          customAtomsData,
        })

        const toggleSwitch = getByTestId('onModelToggle')

        await userEvent.click(toggleSwitch)
        expect(mockSend).toHaveBeenCalledWith('listInteraction', {
          eventLocation: 'header',
          eventAction: 'toggle list click',
          eventLabel: expectedLabel,
        })
      }
    )
  })
})
