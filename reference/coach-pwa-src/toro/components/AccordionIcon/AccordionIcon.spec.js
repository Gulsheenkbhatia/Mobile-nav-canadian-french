import { render } from 'test-utils/react'
import AccordionIcon from './index'
import { AccordionIcon as ChakraUIAccordionIcon } from '@chakra-ui/react'

// Mock ChakraUIAccordionIcon to test prop passing
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  AccordionIcon: jest.fn((props) => <div data-qa="chakra-accordion-icon" {...props} />),
}))

describe('AccordionIcon component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<AccordionIcon />)
    expect(getByTestId('chakra-accordion-icon')).toBeVisible()
  })

  it('passes props correctly to ChakraUIAccordionIcon', () => {
    const testProps = { 'aria-label': 'accordion-icon' }
    const { getByTestId } = render(<AccordionIcon {...testProps} />)

    // Check if ChakraUIAccordionIcon was called with correct props
    expect(ChakraUIAccordionIcon).toHaveBeenCalledWith(expect.objectContaining(testProps), {})
    expect(getByTestId('chakra-accordion-icon')).toHaveAttribute('aria-label', 'accordion-icon')
  })
})
