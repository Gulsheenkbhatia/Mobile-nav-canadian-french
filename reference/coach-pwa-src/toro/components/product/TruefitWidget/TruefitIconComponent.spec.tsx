import { render } from 'test-utils/react'

const setupMocks = (mockName) => {
  jest.resetModules()
  if (mockName === 'TruefitIcon') {
    jest.doMock('@tapestry-inc/design-tokens/kate-spade/icon/object/truefit.svg', () => () => (
      <svg data-qa="TruefitIcon" />
    ))
  } else if (mockName === 'Truefit50') {
    jest.doMock('components/assets/truefit-50.svg', () => () => <svg data-qa="Truefit50" />)
  }
}

const importTruefitIconComponent = () =>
  import('./TruefitIconComponent').then((module) => module.default)

const renderOptions = {
  contexts: {
    PWAContext: {
      appData: {},
    },
  },
}

describe('TruefitIconComponent', () => {
  it('renders TruefitIcon when firstDecimalDigit is not between 1 and 9', async () => {
    setupMocks('TruefitIcon')
    const TruefitIconComponent = await importTruefitIconComponent()
    const { getByTestId } = render(<TruefitIconComponent firstDecimalDigit={0} />, renderOptions)
    expect(getByTestId('TruefitIcon')).toBeVisible()
  })

  it('renders Truefit50 when firstDecimalDigit is between 1 and 9', async () => {
    setupMocks('Truefit50')
    const TruefitIconComponent = await importTruefitIconComponent()
    const { getByTestId } = render(<TruefitIconComponent firstDecimalDigit={6} />, renderOptions)
    expect(getByTestId('Truefit50')).toBeVisible()
  })
})
