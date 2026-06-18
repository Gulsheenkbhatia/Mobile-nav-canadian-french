import React from 'react'
import { render, screen, CustomRenderOptions } from 'test-utils/react'
import { StoreInventoryMessage } from './index'
import usePreference from 'toro/hooks/usePreference_new'
import { EXPERIMENTS } from 'toro/constants/experiments'
import { experimentsAtom } from 'store/experiments.atom'

// Mock only usePreference (useExperiment uses context, useIntl/useMultiStyleConfig use real providers)
jest.mock('toro/hooks/usePreference_new')

const mockUsePreference = jest.mocked(usePreference)

// Custom render helper with experiment enabled by default
const renderComponent = (
  ui: React.ReactElement,
  {
    experimentEnabled = true,
    ...options
  }: CustomRenderOptions & { experimentEnabled?: boolean } = {}
) => {
  const existingAtoms = options.contexts?.JotaiProviderContext || new Map()
  const mergedAtoms = new Map([
    [experimentsAtom, experimentEnabled ? EXPERIMENTS.STORE_INVENTORY_SCARCITY : ''],
    ...Array.from(existingAtoms.entries()),
  ])

  return render(ui, {
    ...options,
    contexts: {
      ...options.contexts,
      JotaiProviderContext: mergedAtoms,
    },
  })
}

describe('StoreInventoryMessage', () => {
  const mockPreferenceWithScarcityEnabled = {
    pdpPreferences: {
      bopisInventoryScarcity: {
        pdp: {
          enableBopisInventoryScarcity: true,
          bopisInventoryLowStockThreshold: 5,
        },
      },
    },
  }

  const mockPreferenceWithScarcityDisabled = {
    pdpPreferences: {
      bopisInventoryScarcity: {
        pdp: {
          enableBopisInventoryScarcity: false,
          bopisInventoryLowStockThreshold: 5,
        },
      },
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePreference.mockReturnValue(mockPreferenceWithScarcityEnabled)
  })

  describe('when scarcity message should be shown', () => {
    beforeEach(() => {
      mockUsePreference.mockReturnValue(mockPreferenceWithScarcityEnabled)
    })

    it('should render scarcity message when all conditions are met', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 3 }} variant="default" />)

      expect(screen.getByTestId('bm_txt_scarcity_msg')).toBeInTheDocument()
      expect(screen.getByText(/📍Popular in stores - only 3 left!/)).toBeInTheDocument()
    })

    it('should render scarcity message with ATS equal to threshold', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 5 }} variant="default" />)

      expect(screen.getByTestId('bm_txt_scarcity_msg')).toBeInTheDocument()
      expect(screen.getByText(/📍Popular in stores - only 5 left!/)).toBeInTheDocument()
    })

    it('should render scarcity message with ATS of 1 (minimum positive)', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 1 }} variant="default" />)

      expect(screen.getByTestId('bm_txt_scarcity_msg')).toBeInTheDocument()
      expect(screen.getByText(/📍Popular in stores - only 1 left!/)).toBeInTheDocument()
    })

    it('should render as a span element', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant="default" />)

      const message = screen.getByTestId('bm_txt_scarcity_msg')
      expect(message.tagName.toLowerCase()).toBe('span')
    })
  })

  describe('when scarcity message should NOT be shown', () => {
    it('should return null when enableBopisInventoryScarcity is false', () => {
      mockUsePreference.mockReturnValue(mockPreferenceWithScarcityDisabled)

      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant="default" />)

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should return null when STORE_INVENTORY_SCARCITY experiment is not enabled', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant="default" />, {
        experimentEnabled: false,
      })

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should return null when ATS is 0', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 0 }} variant="default" />)

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should return null when ATS is greater than threshold', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 10 }} variant="default" />)

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should return null when ATS is negative', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: -1 }} variant="default" />)

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })
  })

  describe('edge cases for storeAvailability', () => {
    it('should handle null storeAvailability gracefully', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={null as any} variant="default" />)

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should handle undefined storeAvailability gracefully', () => {
      renderComponent(
        <StoreInventoryMessage storeAvailability={undefined as any} variant="default" />
      )

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should handle storeAvailability without ATS property', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{} as any} variant="default" />)

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })
  })

  describe('edge cases for bopisInventoryScarcity preference', () => {
    it('should handle null bopisInventoryScarcity gracefully', () => {
      mockUsePreference.mockReturnValue({
        pdpPreferences: {
          bopisInventoryScarcity: null,
        },
      })

      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant="default" />)

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should handle undefined bopisInventoryScarcity gracefully', () => {
      mockUsePreference.mockReturnValue({
        pdpPreferences: {
          bopisInventoryScarcity: undefined,
        },
      })

      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant="default" />)

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should handle missing pdp property in bopisInventoryScarcity', () => {
      mockUsePreference.mockReturnValue({
        pdpPreferences: {
          bopisInventoryScarcity: {},
        },
      })

      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant="default" />)

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should handle missing properties in pdp', () => {
      mockUsePreference.mockReturnValue({
        pdpPreferences: {
          bopisInventoryScarcity: {
            pdp: {},
          },
        },
      })

      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant="default" />)

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should use default values when enableBopisInventoryScarcity is missing', () => {
      mockUsePreference.mockReturnValue({
        pdpPreferences: {
          bopisInventoryScarcity: {
            pdp: {
              bopisInventoryLowStockThreshold: 5,
            },
          },
        },
      })

      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant="default" />)

      // enableBopisInventoryScarcity defaults to false
      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should use default threshold of 0 when bopisInventoryLowStockThreshold is missing', () => {
      mockUsePreference.mockReturnValue({
        pdpPreferences: {
          bopisInventoryScarcity: {
            pdp: {
              enableBopisInventoryScarcity: true,
            },
          },
        },
      })

      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant="default" />)

      // With threshold of 0, ats (2) > threshold (0), so no message shown
      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })
  })

  describe('variants', () => {
    it('should work with default variant', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant="default" />)

      expect(screen.getByTestId('bm_txt_scarcity_msg')).toBeInTheDocument()
    })

    it('should work with availabilityModal variant', () => {
      renderComponent(
        <StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant="availabilityModal" />
      )

      expect(screen.getByTestId('bm_txt_scarcity_msg')).toBeInTheDocument()
    })

    it('should use default variant when variant prop is not provided', () => {
      renderComponent(
        <StoreInventoryMessage storeAvailability={{ ATS: 2 }} variant={undefined as any} />
      )

      expect(screen.getByTestId('bm_txt_scarcity_msg')).toBeInTheDocument()
    })
  })

  describe('multiple conditions combined', () => {
    it('should not show message when multiple conditions fail', () => {
      mockUsePreference.mockReturnValue(mockPreferenceWithScarcityDisabled)

      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 10 }} variant="default" />, {
        experimentEnabled: false,
      })

      expect(screen.queryByTestId('bm_txt_scarcity_msg')).not.toBeInTheDocument()
    })

    it('should show message only when ALL conditions are true', () => {
      mockUsePreference.mockReturnValue(mockPreferenceWithScarcityEnabled)

      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 3 }} variant="default" />)

      expect(screen.getByTestId('bm_txt_scarcity_msg')).toBeInTheDocument()
    })
  })

  describe('message content', () => {
    it('should display the correct count in the scarcity message', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 4 }} variant="default" />)

      expect(screen.getByText(/📍Popular in stores - only 4 left!/)).toBeInTheDocument()
    })

    it('should render icon from scarcityMessageIcon preference when provided', () => {
      const customIconCodePoint = 0x26a0 // ⚠ WARNING SIGN
      mockUsePreference.mockReturnValue({
        pdpPreferences: {
          ...mockPreferenceWithScarcityEnabled.pdpPreferences,
          scarcityMessageIcon: customIconCodePoint,
        },
      })

      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 3 }} variant="default" />)

      const message = screen.getByTestId('bm_txt_scarcity_msg')
      const expectedIcon = String.fromCodePoint(customIconCodePoint)
      expect(message.textContent).toContain(expectedIcon)
      expect(message.textContent).toContain('Popular in stores - only 3 left!')
    })

    it('should display plain message with leading space by default', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 3 }} variant="default" />)

      const message = screen.getByTestId('bm_txt_scarcity_msg')
      expect(message.textContent).toContain('📍Popular in stores - only 3 left!')
      expect(message.textContent).not.toContain('(')
      expect(message.textContent).not.toContain(')')
    })
  })

  describe('altVersion prop', () => {
    it('should display plain message when altVersion is default', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 3 }} altVersion="default" />)

      const message = screen.getByTestId('bm_txt_scarcity_msg')
      expect(message.textContent).toContain('📍Popular in stores - only 3 left!')
      expect(message.textContent).not.toContain('(')
      expect(message.textContent).not.toContain(')')
    })

    it('should show urgency message when altVersion is withUrgency', () => {
      renderComponent(
        <StoreInventoryMessage storeAvailability={{ ATS: 3 }} altVersion="withUrgency" />
      )

      const message = screen.getByTestId('bm_txt_scarcity_msg')
      expect(message.textContent).toMatch('Only 3 in stock - order soon!')
      expect(message.textContent).toMatch(/^\s*Only 3 in stock - order soon!\s*$/)
    })

    it('should default to plain message when altVersion is not provided', () => {
      renderComponent(<StoreInventoryMessage storeAvailability={{ ATS: 3 }} />)

      const message = screen.getByTestId('bm_txt_scarcity_msg')
      expect(message.textContent).toContain('📍Popular in stores - only 3 left!')
      expect(message.textContent).not.toContain('(')
      expect(message.textContent).not.toContain(')')
    })

    it('should show urgency message for availabilityModal variant', () => {
      renderComponent(
        <StoreInventoryMessage
          storeAvailability={{ ATS: 2 }}
          variant="availabilityModal"
          altVersion="withUrgency"
        />
      )

      const message = screen.getByTestId('bm_txt_scarcity_msg')
      expect(message.textContent).toContain('Only 2 in stock - order soon!')
    })
  })
})
