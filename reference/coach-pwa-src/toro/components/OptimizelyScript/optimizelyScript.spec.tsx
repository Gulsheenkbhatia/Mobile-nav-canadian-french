import { render, cleanup } from 'test-utils/react'
import React from 'react'
import Head from 'next/head'
import OptimizelyScript, { insertOptimizelyScript } from 'toro/components/OptimizelyScript'

// Mocking next/head to avoid injecting the script into the head element.
const MockedHeadComponent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
jest.mock('next/head')
jest.mock('toro/helpers/isLowPoweredDevice')
jest.mocked(Head).mockImplementation(MockedHeadComponent)

// Helper function for rendering OptimizelyScript component
const renderComponent = (props) => {
  return render(<OptimizelyScript {...props} />, {
    contexts: { PWAContext: { appData: { enableOptimizely: true } } },
  })
}

describe('OptimizelyScript Component', () => {
  let mockWindow

  beforeEach(() => {
    mockWindow = {
      isLowPoweredDevice: jest.fn(),
    }
    document.head.innerHTML = '' // Clear any existing scripts
  })

  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  it('renders script for desktop devices', () => {
    const { container } = renderComponent({ deviceType: 'desktop', enableLowPoweredDevice: true })
    const script = container.querySelector('script[src="/api/optimizely-script"]')
    expect(script).toBeInTheDocument()
  })

  it('should not append script if isLowPoweredDevice returns true', () => {
    mockWindow.isLowPoweredDevice.mockReturnValue(true)
    insertOptimizelyScript(mockWindow, document, { deviceType: 'mobile' })
    expect(document.querySelector('script')).not.toBeInTheDocument()
  })

  it('should append script if conditions are met', () => {
    mockWindow.isLowPoweredDevice.mockReturnValue(false)
    insertOptimizelyScript(mockWindow, document, { deviceType: 'desktop' })
    const script = document.querySelector('script')
    expect(script).toBeInTheDocument()
    expect(script).toHaveAttribute('src', '/api/optimizely-script')
    expect(script).toHaveAttribute('type', 'text/javascript')
  })
})
