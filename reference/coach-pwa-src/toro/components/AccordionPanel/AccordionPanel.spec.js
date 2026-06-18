import React from 'react'
import { render } from 'test-utils/react'
import { waitFor } from '@testing-library/dom' // to wait for async chakraui animations
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  ChakraProvider,
  extendTheme,
} from '@chakra-ui/react'
import AccordionPanel from '.'

// Create a ChakraProvider with a custom theme to wrap our tests
const theme = extendTheme({})
const Providers = ({ children }) => <ChakraProvider theme={theme}>{children}</ChakraProvider>

window.scrollTo = jest.fn()

describe('AccordionPanel component', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Accordion defaultIndex={[0]}>
        <AccordionItem>
          <AccordionButton>Section 1 title</AccordionButton>
          <AccordionPanel>Panel Content</AccordionPanel>
        </AccordionItem>
      </Accordion>,
      { wrapper: Providers }
    )
    expect(container).toBeVisible()
  })

  it('passes props to ChakraUIAccordionPanel', async () => {
    const testId = 'accordion-panel'
    const { getByTestId } = render(
      <Accordion defaultIndex={[0]}>
        <AccordionItem>
          <AccordionButton>Section 1 title</AccordionButton>
          <AccordionPanel data-qa={testId}>Panel Content</AccordionPanel>
        </AccordionItem>
      </Accordion>,
      { wrapper: Providers }
    )
    await waitFor(() => {
      expect(getByTestId(testId)).toBeVisible()
    })
  })

  it('renders children correctly', async () => {
    const children = <div>Test Content</div>
    const { queryByText } = render(
      <Accordion defaultIndex={[0]}>
        <AccordionItem>
          <AccordionButton>Section 1 title</AccordionButton>
          <AccordionPanel>{children}</AccordionPanel>
        </AccordionItem>
      </Accordion>,
      { wrapper: Providers }
    )
    await waitFor(() => {
      expect(queryByText('Test Content')).toBeVisible()
    })
  })

  it('handles className prop correctly', async () => {
    const { container } = render(
      <Accordion defaultIndex={[0]}>
        <AccordionItem>
          <AccordionButton>Toggle</AccordionButton>
          <AccordionPanel className="test-class" />
        </AccordionItem>
      </Accordion>,
      { wrapper: Providers }
    )
    await waitFor(() => {
      expect(container.querySelector('.test-class')).toBeVisible()
    })
  })
})
