import React from 'react'
import { render } from 'test-utils/react'
import TruefitScore from './TruefitScore'

jest.mock('./TruefitIconComponent', () => jest.fn(() => <div data-qa="truefit-icon" />))
const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}
describe('TruefitScore', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders the correct number of filled icons for whole numbers', () => {
    const { getAllByTestId } = render(<TruefitScore score={8} />, renderOptions)

    expect(getAllByTestId('truefit-icon')).toHaveLength(4)
  })

  it('renders the correct number of filled icons for fractional numbers', () => {
    const { getAllByTestId } = render(<TruefitScore score={4.5} />, renderOptions)
    expect(getAllByTestId('truefit-icon')).toHaveLength(3)
  })

  it('renders no icons if score is 0', () => {
    const { queryByTestId } = render(<TruefitScore score={0} />, renderOptions)
    expect(queryByTestId('truefit-icon')).not.toBeInTheDocument()
  })
})
