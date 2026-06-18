import { render, screen } from 'test-utils/react'
import ProductSizeControlText from './ProductSizeControlText'

describe('<ProductSizeControlText />', () => {
  it.each([
    {
      text: 'SMALL',
      expectedElementsText: ['SMALL'],
    },
    {
      text: {
        EU: 'SMALL',
      },
      selectedCountry: 'EU',
      expectedElementsText: ['SMALL'],
    },
    {
      text: {
        EU: 'SMALL/LARGE',
      },
      selectedCountry: 'EU',
      expectedElementsText: ['SMALL', 'LARGE'],
    },
  ])('should render properly', ({ text, selectedCountry, expectedElementsText }) => {
    render(<ProductSizeControlText text={text} selectedCountry={selectedCountry} />, {
      contexts: {},
    })

    expectedElementsText.forEach((text) => {
      const textElement = screen.getByText(text)
      expect(textElement).toBeVisible()
    })
  })
})
