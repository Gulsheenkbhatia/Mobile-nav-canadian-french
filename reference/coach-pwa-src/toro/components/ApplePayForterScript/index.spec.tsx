import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import { useAtomValue } from 'jotai/utils'
import usePreference from 'toro/hooks/usePreference_new'
import isBrowser from 'toro/helpers/isBrowser'
import { isApplePayAvailable } from 'toro/components/PaymentWidget/helpers'
// import { AlterCtaToShow } from 'store/pdp.atom'
import ApplePayForterScriptWrapper from './index'

const AlterCtaToShow = {
  APPLEPAY: 'applePay',
  BUYNOW: 'buyNow',
}
// Mock the store/pdp.atom module
jest.mock('store/pdp.atom', () => ({
  AlterCtaToShow,
  alterCtaToShowAtom: 'mock-atom',
}))

// Mock the dynamic import
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    return function MockApplePayForterScript({ forterSiteID }: { forterSiteID: string }) {
      return <div data-testid="apple-pay-forter-script">{forterSiteID}</div>
    }
  },
}))

// Mock the hooks and utilities
jest.mock('toro/hooks/usePreference_new')
jest.mock('jotai/utils', () => ({
  useAtomValue: jest.fn(),
}))
jest.mock('toro/helpers/isBrowser', () => jest.fn())
jest.mock('toro/components/PaymentWidget/helpers', () => ({
  isApplePayAvailable: jest.fn(),
}))

const mockUsePreference = usePreference as jest.Mock
const mockUseAtomValue = useAtomValue as jest.Mock
const mockIsBrowser = isBrowser as jest.Mock
const mockIsApplePayAvailable = isApplePayAvailable as jest.Mock

const setup = (): RenderResult => {
  return render(<ApplePayForterScriptWrapper />, {})
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('ApplePayForterScriptWrapper', () => {
  test('renders ApplePayForterScript when all conditions are met', () => {
    // Arrange
    mockUsePreference.mockReturnValue({
      applePayConfigs: {
        forterSiteID: 'test-site-id',
      },
    })
    mockUseAtomValue.mockReturnValue(AlterCtaToShow.APPLEPAY)
    mockIsBrowser.mockReturnValue(true)
    mockIsApplePayAvailable.mockReturnValue(true)

    // Act
    const { getByTestId, getByText } = setup()

    // Assert
    expect(getByTestId('apple-pay-forter-script')).toBeInTheDocument()
    expect(getByText('test-site-id')).toBeInTheDocument()
  })

  test('does not render when forterSiteID is empty', () => {
    // Arrange
    mockUsePreference.mockReturnValue({
      applePayConfigs: {
        forterSiteID: '',
      },
    })
    mockUseAtomValue.mockReturnValue(AlterCtaToShow.APPLEPAY)
    mockIsBrowser.mockReturnValue(true)
    mockIsApplePayAvailable.mockReturnValue(true)

    // Act
    const { queryByTestId } = setup()

    // Assert
    expect(queryByTestId('apple-pay-forter-script')).not.toBeInTheDocument()
  })

  test('does not render when alterCtaToShow is BUYNOW', () => {
    // Arrange
    mockUsePreference.mockReturnValue({
      applePayConfigs: {
        forterSiteID: 'test-site-id',
      },
    })
    mockUseAtomValue.mockReturnValue(AlterCtaToShow.BUYNOW)
    mockIsBrowser.mockReturnValue(true)
    mockIsApplePayAvailable.mockReturnValue(true)

    // Act
    const { queryByTestId } = setup()

    // Assert
    expect(queryByTestId('apple-pay-forter-script')).not.toBeInTheDocument()
  })

  test('does not render when ApplePay is not available', () => {
    // Arrange
    mockUsePreference.mockReturnValue({
      applePayConfigs: {
        forterSiteID: 'test-site-id',
      },
    })
    mockUseAtomValue.mockReturnValue(AlterCtaToShow.APPLEPAY)
    mockIsBrowser.mockReturnValue(true)
    mockIsApplePayAvailable.mockReturnValue(false)

    // Act
    const { queryByTestId } = setup()

    // Assert
    expect(queryByTestId('apple-pay-forter-script')).not.toBeInTheDocument()
  })
})
