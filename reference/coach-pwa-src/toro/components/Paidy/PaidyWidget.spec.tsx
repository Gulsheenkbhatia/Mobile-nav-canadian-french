import { render, screen, waitFor } from 'test-utils/react'
import usePreference from 'toro/hooks/usePreference_new'
import PaidyWidget from 'toro/components/Paidy/PaidyWidget'
import { ProductMainSectionBreakpointContext } from 'toro/components/product/ProductMainSection/context'
import { Provider as JotaiProvider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import { appLoadingAtom } from 'store/pdp.atom'
import Script from 'next/script'

declare global {
  interface Window {
    _paidy?: (action: string) => void
  }
}
window._paidy = jest.fn()

jest.mock('toro/hooks/usePreference_new')
jest.mock('next/script', () => jest.fn(() => null))

const mockedUsePreference = jest.mocked(usePreference)

const HydrateAtomsWrapper = ({ children, atomValues }) => {
  useHydrateAtoms(atomValues)
  return children
}

const setup = ({
  apploading = false,
  hasPromoOnPDP = false,
  isBelowAtcPlacement = false,
}: {
  apploading?: boolean
  hasPromoOnPDP?: boolean
  isBelowAtcPlacement?: boolean
} = {}) => {
  const atomValues = [[appLoadingAtom, apploading]]

  return render(
    <JotaiProvider>
      <HydrateAtomsWrapper atomValues={atomValues}>
        <ProductMainSectionBreakpointContext.Provider
          value={{
            selectedColor: 'red',
            selectedVariant: 'L',
          }}
        >
          <PaidyWidget hasPromoOnPDP={hasPromoOnPDP} isBelowAtcPlacement={isBelowAtcPlacement} />
        </ProductMainSectionBreakpointContext.Provider>
      </HydrateAtomsWrapper>
    </JotaiProvider>,
    { contexts: {} }
  )
}

describe('<PaidyWidget />', () => {
  beforeEach(() => {
    mockedUsePreference.mockReturnValue({
      paidy: { paidy_script_url: 'http://test-script-url' },
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render PaidyWidget when price is in range', () => {
    document.body.innerHTML = '<div class="pdp-active-price">¥88,000</div>'
    setup()

    const paidyDiv = screen.getByTestId('paidy-wrapper')
    expect(paidyDiv).toBeInTheDocument()
    expect(paidyDiv).toHaveAttribute('data-amount', '¥88,000')
    expect(paidyDiv).toHaveAttribute('data-logo-color', 'black')
    expect(paidyDiv).toHaveAttribute('data-alignment', 'start')
    expect(paidyDiv).toHaveAttribute('data-6-pay-enabled')
    expect(paidyDiv).toHaveAttribute('data-12-pay-enabled')
  })

  it('should use center alignment for below-CTA placement', () => {
    document.body.innerHTML = '<div class="pdp-active-price">¥88,000</div>'
    setup({ isBelowAtcPlacement: true })

    const paidyDiv = screen.getByTestId('paidy-wrapper')
    expect(paidyDiv).toHaveAttribute('data-alignment', 'center')
  })

  it('should not render PaidyWidget when price is lower than the min value', () => {
    document.body.innerHTML = '<div class="pdp-active-price">¥2,500</div>'
    setup()

    const paidyDiv = screen.queryByTestId('paidy-wrapper')
    expect(paidyDiv).not.toBeInTheDocument()
  })

  it('should not render PaidyWidget when price is greater than the max value', () => {
    document.body.innerHTML = '<div class="pdp-active-price">¥300,500</div>'
    setup()

    const paidyDiv = screen.queryByTestId('paidy-wrapper')
    expect(paidyDiv).not.toBeInTheDocument()
  })

  it('should not render PaidyWidget when price it is an invalid value', () => {
    document.body.innerHTML = '<div class="pdp-active-price">N/A</div>'
    setup()

    const paidyDiv = screen.queryByTestId('paidy-wrapper')
    expect(paidyDiv).not.toBeInTheDocument()
  })

  it('should not render PaidyWidget when apploading is true', () => {
    setup({ apploading: true })

    const paidyDiv = screen.queryByTestId('paidy-wrapper')
    expect(paidyDiv).not.toBeInTheDocument()
  })

  it('should not render PaidyWidget when $pdpActivePriceElement is null', () => {
    document.body.innerHTML = '<div></div>'
    setup({ hasPromoOnPDP: true })

    const paidyDiv = screen.queryByTestId('paidy-wrapper')
    expect(paidyDiv).not.toBeInTheDocument()
  })

  it('should set isPaidyScriptLoaded to true when the script loads successfully', async () => {
    setup()

    const ScriptComponent = (Script as jest.Mock).mock.calls[0][0]
    await waitFor(() => ScriptComponent.onLoad())

    expect(Script).toHaveBeenCalledWith(
      expect.objectContaining({
        onLoad: expect.any(Function),
      }),
      expect.anything()
    )
    expect(ScriptComponent.onLoad).toBeInstanceOf(Function)
  })

  it('should set isPaidyScriptError to true when the script fails to load', async () => {
    setup()

    const ScriptComponent = (Script as jest.Mock).mock.calls[0][0]
    await waitFor(() => ScriptComponent.onError())

    expect(Script).toHaveBeenCalledWith(
      expect.objectContaining({
        onError: expect.any(Function),
      }),
      expect.anything()
    )
    expect(ScriptComponent.onError).toBeInstanceOf(Function)
  })
})
