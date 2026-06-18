import { render, screen, fireEvent } from 'test-utils/react'
import CollapsibleProductSection from './index'
import { useIntl } from 'react-intl'
import { useAtomValue } from 'jotai/utils'
import useAnalytics from 'toro/analytics/useAnalytics'
import useProductData from 'toro/hooks/useProductData'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'

// Mock dependencies
jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl')
  return {
    ...actual,
    useIntl: jest.fn(),
  }
})

jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
  atomWithReset: jest.fn(),
  atomWithStorage: jest.fn(),
  createJSONStorage: jest.fn(),
}))

jest.mock('store/pdp.atom', () => ({
  isMegaPDPEligibleAtom: 'isMegaPDPEligibleAtom',
  isNewMegaPDPEligibleAtom: 'isNewMegaPDPEligibleAtom',
}))

jest.mock('toro/analytics/useAnalytics')
jest.mock('toro/hooks/useProductData')
jest.mock('toro/hooks/useMultiStyleConfig')

// Mock UI components
jest.mock('toro/components/Text', () => {
  return function MockText({ children }: { children: React.ReactNode }) {
    return <span data-qa="mock-text">{children}</span>
  }
})

jest.mock('toro/components/Accordion', () => {
  return function MockAccordion({ children }: { children: React.ReactNode }) {
    return <div data-qa="mock-accordion">{children}</div>
  }
})

jest.mock('toro/components/AccordionItem', () => {
  return function MockAccordionItem({ children }: { children: any }) {
    return (
      <div data-qa="mock-accordion-item">
        <div data-qa="expanded-false">{children({ isExpanded: false })}</div>
        <div data-qa="expanded-true">{children({ isExpanded: true })}</div>
      </div>
    )
  }
})

jest.mock('toro/components/AccordionButton', () => {
  return function MockAccordionButton({ children, onClick }: any) {
    return (
      <button data-qa="mock-accordion-button" onClick={onClick}>
        {children}
      </button>
    )
  }
})

jest.mock('toro/components/AccordionPanel', () => {
  return function MockAccordionPanel({ children }: { children: React.ReactNode }) {
    return <div data-qa="mock-accordion-panel">{children}</div>
  }
})

describe('CollapsibleProductSection', () => {
  const mockFormatMessage = jest.fn()
  const mockSendAnalytics = jest.fn()
  const mockUseAtomValue = useAtomValue as jest.Mock
  const mockUseAnalytics = useAnalytics as jest.Mock
  const mockUseProductData = useProductData as jest.Mock
  const mockUseMultiStyleConfig = useMultiStyleConfig as jest.Mock
  const mockUseIntl = useIntl as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseIntl.mockReturnValue({
      formatMessage: mockFormatMessage,
    })
    mockFormatMessage.mockReturnValue('About this product')

    mockUseAnalytics.mockReturnValue({
      send: mockSendAnalytics,
    })

    mockUseAtomValue.mockReturnValue(false) // Default: neither mega PDP eligible
    mockUseProductData.mockReturnValue(['test-product-id'])

    mockUseMultiStyleConfig.mockImplementation((name) => {
      if (name === 'Icons') {
        return {
          AccordionIcon: () => <svg data-qa="accordion-icon" />,
          AccordionIconExpanded: () => <svg data-qa="accordion-icon-expanded" />,
        }
      }
      return {
        wrapper: {},
        parentItem: {},
        parentButton: {},
        parentButtonText: {},
        parentIcon: {},
        parentPanel: {},
      }
    })
  })

  it('renders children correctly', () => {
    render(
      <CollapsibleProductSection>
        <div data-qa="child-content">Test Child</div>
      </CollapsibleProductSection>
    )

    // Since we render both states in our mock, we expect 2 children
    const children = screen.getAllByTestId('child-content')
    expect(children.length).toBe(2)
    expect(children[0]).toBeInTheDocument()
  })

  it('renders the correct title from useIntl', () => {
    render(
      <CollapsibleProductSection>
        <div>Test Child</div>
      </CollapsibleProductSection>
    )

    expect(mockFormatMessage).toHaveBeenCalledWith({
      id: 'pdp.collapsible.aboutProduct.title',
      defaultMessage: 'About this product',
    })

    const texts = screen.getAllByTestId('mock-text')
    expect(texts[0]).toHaveTextContent('About this product')
  })

  it('fires analytics event when accordion is clicked and isExpanded is false', () => {
    render(
      <CollapsibleProductSection>
        <div>Test Child</div>
      </CollapsibleProductSection>
    )

    // Get the button from the expanded=false section
    const expandedFalseSection = screen.getByTestId('expanded-false')
    const button = expandedFalseSection.querySelector(
      '[data-qa="mock-accordion-button"]'
    ) as HTMLButtonElement

    fireEvent.click(button)

    expect(mockSendAnalytics).toHaveBeenCalledWith('productInteraction', {
      eventLocation: 'product',
      eventAction: 'accordion click: about this product',
      eventLabel: 'test-product-id',
    })
  })

  it('does not fire analytics event when accordion is clicked and isExpanded is true', () => {
    render(
      <CollapsibleProductSection>
        <div>Test Child</div>
      </CollapsibleProductSection>
    )

    // Get the button from the expanded=true section
    const expandedTrueSection = screen.getByTestId('expanded-true')
    const button = expandedTrueSection.querySelector(
      '[data-qa="mock-accordion-button"]'
    ) as HTMLButtonElement

    fireEvent.click(button)

    expect(mockSendAnalytics).not.toHaveBeenCalled()
  })

  it('uses "mega product" as eventLocation when isMegaPDPEligible is true', () => {
    // Mock isMegaPDPEligible to true for the first call
    mockUseAtomValue.mockImplementation((atom) => {
      if (atom.toString().includes('isMegaPDPEligibleAtom')) return true
      return false
    })

    render(
      <CollapsibleProductSection>
        <div>Test Child</div>
      </CollapsibleProductSection>
    )

    const expandedFalseSection = screen.getByTestId('expanded-false')
    const button = expandedFalseSection.querySelector(
      '[data-qa="mock-accordion-button"]'
    ) as HTMLButtonElement

    fireEvent.click(button)

    expect(mockSendAnalytics).toHaveBeenCalledWith('productInteraction', {
      eventLocation: 'mega product',
      eventAction: 'accordion click: about this product',
      eventLabel: 'test-product-id',
    })
  })

  it('renders correct icons based on isExpanded state', () => {
    render(
      <CollapsibleProductSection>
        <div>Test Child</div>
      </CollapsibleProductSection>
    )

    const expandedFalseSection = screen.getByTestId('expanded-false')
    expect(expandedFalseSection.querySelector('[data-qa="accordion-icon"]')).toBeInTheDocument()
    expect(
      expandedFalseSection.querySelector('[data-qa="accordion-icon-expanded"]')
    ).not.toBeInTheDocument()

    const expandedTrueSection = screen.getByTestId('expanded-true')
    expect(
      expandedTrueSection.querySelector('[data-qa="accordion-icon-expanded"]')
    ).toBeInTheDocument()
    expect(expandedTrueSection.querySelector('[data-qa="accordion-icon"]')).not.toBeInTheDocument()
  })
})
