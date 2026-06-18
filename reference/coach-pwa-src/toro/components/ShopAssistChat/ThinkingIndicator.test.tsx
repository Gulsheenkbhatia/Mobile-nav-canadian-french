import React from 'react'
import { render, screen } from 'test-utils/react'
import StylesProvider from 'toro/components/StylesProvider'
import ThinkingIndicator from 'toro/components/ShopAssistChat/ThinkingIndicator'

describe('ThinkingIndicator', () => {
  it('shows the first thinking message on the first mount', () => {
    render(
      <StylesProvider value={{}}>
        <ThinkingIndicator />
      </StylesProvider>
    )

    expect(screen.getByText('Thinking of something special')).toBeVisible()
  })

  it('shows the second thinking message on the next mount', () => {
    render(
      <StylesProvider value={{}}>
        <ThinkingIndicator />
      </StylesProvider>
    )

    expect(screen.getByText('Looking for the right fit')).toBeVisible()
  })
})
