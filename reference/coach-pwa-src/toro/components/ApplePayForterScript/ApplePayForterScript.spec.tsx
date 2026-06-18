import React from 'react'
import { render, RenderResult } from 'test-utils/react'
import ApplePayForterScript from './ApplePayForterScript'

// Mock next/script
jest.mock('next/script', () => {
  return {
    __esModule: true,
    default: ({
      children,
      id,
      type,
      strategy,
    }: {
      children: React.ReactNode
      id: string
      type: string
      strategy: string
    }) => (
      <script id={id} type={type} data-strategy={strategy}>
        {children}
      </script>
    ),
  }
})

// Mock the script text
jest.mock(
  'toro/components/ApplePayForterScript/applePayForterScriptText',
  () => 'test script with {SITE_ID}'
)

const setup = (props = {}): RenderResult => {
  return render(<ApplePayForterScript {...props} />, {})
}

describe('ApplePayForterScript', () => {
  test('renders script with provided forterSiteID', () => {
    const forterSiteID = 'test-site-id'
    const { container } = setup({ forterSiteID })

    const script = container.querySelector('script')
    expect(script).toBeInTheDocument()
    expect(script).toHaveAttribute('type', 'text/javascript')
    expect(script).toHaveAttribute('id', forterSiteID)
    expect(script).toHaveAttribute('data-strategy', 'lazyOnload')
    expect(script).toHaveTextContent('test script with test-site-id')
  })

  test('renders script with empty forterSiteID when not provided', () => {
    const { container } = setup()

    const script = container.querySelector('script')
    expect(script).toBeInTheDocument()
    expect(script).toHaveAttribute('type', 'text/javascript')
    expect(script).toHaveAttribute('id', '')
    expect(script).toHaveAttribute('data-strategy', 'lazyOnload')
    expect(script).toHaveTextContent('test script with')
  })

  test('replaces {SITE_ID} placeholder with forterSiteID', () => {
    const forterSiteID = 'custom-site-id'
    const { container } = setup({ forterSiteID })

    const script = container.querySelector('script')
    expect(script).toHaveTextContent('test script with custom-site-id')
  })
})
