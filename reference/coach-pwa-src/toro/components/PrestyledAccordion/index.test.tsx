import React from 'react'
import { render, screen, fireEvent, waitFor } from 'test-utils/react'
import PrestyledAccordion from './index'

describe('PrestyledAccordion', () => {
  beforeAll(() => {
    // Mock window.scrollTo to avoid JSDOM "Not implemented" error from framer-motion/Chakra
    Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockItems = [
    { title: 'Section 1', content: <div>Content 1</div> },
    { title: 'Section 2', content: <div>Content 2</div> },
  ]

  it('renders correctly with required props', () => {
    render(<PrestyledAccordion accordionItems={mockItems} />)

    expect(screen.getByText('Section 1')).toBeInTheDocument()
    expect(screen.getByText('Section 2')).toBeInTheDocument()

    // Check default collapsed state (icons)
    expect(screen.getAllByTestId('icon-collapsed')).toHaveLength(2)
    expect(screen.queryByTestId('icon-expanded')).not.toBeInTheDocument()
  })

  it('renders the main title when provided', () => {
    render(<PrestyledAccordion accordionItems={mockItems} accordionTitle="FAQ" />)
    expect(screen.getByText('FAQ')).toBeInTheDocument()
  })

  it('toggles expansion state on click', async () => {
    render(<PrestyledAccordion accordionItems={mockItems} allowToggle />)

    const buttons = screen.getAllByRole('button')
    const firstButton = buttons[0]

    // Initially collapsed
    expect(screen.getAllByTestId('icon-collapsed')).toHaveLength(2)

    // Click to expand
    fireEvent.click(firstButton)

    // Wait for state update if necessary, though fireEvent is sync usually
    await waitFor(() => {
      expect(screen.getByTestId('icon-expanded')).toBeInTheDocument()
    })

    // One expanded, one collapsed
    expect(screen.getAllByTestId('icon-collapsed')).toHaveLength(1)
    expect(screen.getAllByTestId('icon-expanded')).toHaveLength(1)

    // Click to collapse
    fireEvent.click(firstButton)

    await waitFor(() => {
      expect(screen.queryByTestId('icon-expanded')).not.toBeInTheDocument()
    })
    expect(screen.getAllByTestId('icon-collapsed')).toHaveLength(2)
  })

  it('renders content in panel', () => {
    render(<PrestyledAccordion accordionItems={mockItems} />)
    // Content should be in the document
    expect(screen.getByText('Content 1')).toBeInTheDocument()
    expect(screen.getByText('Content 2')).toBeInTheDocument()
  })

  it('handles empty accordionItems gracefully', () => {
    render(<PrestyledAccordion accordionItems={[]} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('handles undefined accordionItems gracefully (default param)', () => {
    render(<PrestyledAccordion accordionItems={undefined} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
