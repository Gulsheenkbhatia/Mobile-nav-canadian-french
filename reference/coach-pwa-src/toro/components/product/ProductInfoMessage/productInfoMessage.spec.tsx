import React from 'react'
import { render } from 'test-utils/react'
import ProductInfoMessage from './index'

describe('ProductInfoMessage', () => {
  it('renders the alert icon when variant is alert', () => {
    const { getByText, container } = render(
      <ProductInfoMessage variant="alert">Alert message</ProductInfoMessage>
    )

    expect(getByText('Alert message')).toBeVisible()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render the alert icon when variant is not alert', () => {
    const { getByText, container } = render(
      <ProductInfoMessage variant="info">Info message</ProductInfoMessage>
    )

    expect(getByText('Info message')).toBeVisible()
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('passes down textProps to the Text component', () => {
    const { getByLabelText } = render(
      <ProductInfoMessage textProps={{ 'aria-label': 'custom-label' }} isQuickView={true}>
        Custom Text Props
      </ProductInfoMessage>
    )

    expect(getByLabelText('custom-label')).toBeInTheDocument()
  })
})
