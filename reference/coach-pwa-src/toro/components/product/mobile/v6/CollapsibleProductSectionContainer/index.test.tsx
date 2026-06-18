import { render, screen } from 'test-utils/react'
import { useExpandableAccordionLogic } from 'toro/hooks/useExpandableAccordionLogic'
import CollapsibleProductSectionContainer from './index'

// Mock dependencies
jest.mock('toro/hooks/useExpandableAccordionLogic')
jest.mock('toro/components/product/mobile/CollapsibleProductSection', () => {
  return function MockCollapsibleProductSection({ children }: { children: React.ReactNode }) {
    return <div data-qa="collapsible-section">{children}</div>
  }
})

describe('CollapsibleProductSectionContainer', () => {
  const mockUseExpandableAccordionLogic = useExpandableAccordionLogic as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders children inside CollapsibleProductSection when shouldShowCollapsible is true', () => {
    // Arrange
    mockUseExpandableAccordionLogic.mockReturnValue({
      shouldShowCollapsible: true,
    })

    // Act
    render(
      <CollapsibleProductSectionContainer>
        <div data-qa="child-content">Test Child</div>
      </CollapsibleProductSectionContainer>
    )

    // Assert
    expect(screen.getByTestId('collapsible-section')).toBeInTheDocument()
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByTestId('collapsible-section')).toContainElement(
      screen.getByTestId('child-content')
    )
  })

  it('renders children without CollapsibleProductSection when shouldShowCollapsible is false', () => {
    // Arrange
    mockUseExpandableAccordionLogic.mockReturnValue({
      shouldShowCollapsible: false,
    })

    // Act
    render(
      <CollapsibleProductSectionContainer>
        <div data-qa="child-content">Test Child</div>
      </CollapsibleProductSectionContainer>
    )

    // Assert
    expect(screen.queryByTestId('collapsible-section')).not.toBeInTheDocument()
    expect(screen.getByTestId('child-content')).toBeInTheDocument()
  })
})
