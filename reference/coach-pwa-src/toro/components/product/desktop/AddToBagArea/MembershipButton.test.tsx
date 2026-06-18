import React from 'react'
import { render, screen } from '@testing-library/react'
import MembershipButton from './MembershipButton'
import * as JotaiUtils from 'jotai/utils'
import * as UseProductData from 'toro/hooks/useProductData'
import * as UseStyles from 'toro/hooks/useStyles'
import { TemplateName } from 'toro/constants/templates'

// Mocking dependencies
jest.mock('./TooltipVariationMessages', () => () => <div data-qa="tooltip-mock">Tooltip Mock</div>)
jest.mock('toro/components/product/SigninMemberButton', () => ({ productData }) => (
  <button data-qa="signin-button-mock" data-product-id={productData.id}>
    Signin Button Mock
  </button>
))
jest.mock('toro/components/Flex', () => ({ children, sx, flexDirection, ...props }) => (
  <div data-qa="flex-mock" data-flex-direction={flexDirection} {...props}>
    {children}
  </div>
))
jest.mock('toro/components/Template', () => ({ children, notForIDs }) => (
  <div data-testid="template-mock" data-not-for-ids={notForIDs?.join(',')}>
    {children}
  </div>
))

describe('MembershipButton Component', () => {
  // Mock implementation for our hooks
  const mockUseAtomValue = jest.fn()
  const mockUseProductData = jest.fn()
  const mockUseStyles = jest.fn()

  // Setup before each test
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup spy on useAtomValue
    jest.spyOn(JotaiUtils, 'useAtomValue').mockImplementation(mockUseAtomValue)

    // Setup spy on useProductData
    jest.spyOn(UseProductData, 'default').mockImplementation(mockUseProductData)

    // Setup spy on useStyles
    jest.spyOn(UseStyles, 'default').mockImplementation(mockUseStyles)

    // Default mocks
    mockUseAtomValue.mockReturnValue({ id: 'variant-123' })
    mockUseProductData.mockReturnValue('product-456')
    mockUseStyles.mockReturnValue({
      membershipButtonArea: { padding: '10px' },
    })
  })

  describe('Rendering', () => {
    it('should render button and tooltip with default props', () => {
      render(<MembershipButton />)
      expect(screen.getByText('Signin Button Mock')).toBeVisible()
      expect(screen.getByText('Tooltip Mock')).toBeVisible()
      expect(screen.getByTestId('template-mock')).toHaveAttribute(
        'data-not-for-ids',
        `${TemplateName.pdpv6},${TemplateName.pdpv5_1},${TemplateName.pdpv7}`
      )
    })

    it('should pass product variant ID to SigninMemberButton when available', () => {
      render(<MembershipButton />)
      expect(screen.getByText('Signin Button Mock')).toHaveAttribute(
        'data-product-id',
        'variant-123'
      )
    })

    it('should use product ID from useProductData when variant ID is not available', () => {
      mockUseAtomValue.mockReturnValue({}) // Empty variant with no ID
      render(<MembershipButton />)
      expect(screen.getByText('Signin Button Mock')).toHaveAttribute(
        'data-product-id',
        'product-456'
      )
    })

    it('should render Template component with correct notForIDs prop', () => {
      render(<MembershipButton />)
      expect(screen.getByTestId('template-mock')).toHaveAttribute(
        'data-not-for-ids',
        `${TemplateName.pdpv6},${TemplateName.pdpv5_1},${TemplateName.pdpv7}`
      )
      expect(screen.getByTestId('template-mock')).toContainElement(screen.getByText('Tooltip Mock'))
    })
  })
})
