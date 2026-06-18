import React from 'react'
import { render, fireEvent } from 'test-utils/react'
import { act } from '@testing-library/react'
import SwipeWrapper from './SwipeWrapper'

describe('SwipeWrapper', () => {
  const mockOnSwipeLeft = jest.fn()
  const mockOnSwipeRight = jest.fn()
  const defaultProps = {
    onSwipeLeft: mockOnSwipeLeft,
    onSwipeRight: mockOnSwipeRight,
  }

  const testChildren = <div data-qa="test-content">Test Content</div>

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render children correctly', () => {
    const { getByTestId } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
    expect(getByTestId('test-content')).toBeInTheDocument()
  })

  describe('Swipe Detection', () => {
    it('should trigger onSwipeLeft when swiping left with default threshold', () => {
      const { container } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
      const wrapperDiv = container.firstChild as HTMLElement

      // Simulate a leftward swipe (positive deltaX)
      fireEvent.wheel(wrapperDiv, {
        deltaX: 120, // Above default threshold of 100
        deltaY: 10, // Less than deltaX to ensure horizontal detection
      })

      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)
      expect(mockOnSwipeRight).not.toHaveBeenCalled()
    })

    it('should trigger onSwipeRight when swiping right with default threshold', () => {
      const { container } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
      const wrapperDiv = container.firstChild as HTMLElement

      // Simulate a rightward swipe (negative deltaX)
      fireEvent.wheel(wrapperDiv, {
        deltaX: -120, // Below negative threshold of -100
        deltaY: 10, // Less than deltaX to ensure horizontal detection
      })

      expect(mockOnSwipeRight).toHaveBeenCalledTimes(1)
      expect(mockOnSwipeLeft).not.toHaveBeenCalled()
    })

    it('should respect custom threshold prop', () => {
      const customThreshold = 200
      const { container } = render(
        <SwipeWrapper {...defaultProps} threshold={customThreshold}>
          {testChildren}
        </SwipeWrapper>
      )
      const wrapperDiv = container.firstChild as HTMLElement

      // Swipe below custom threshold should not trigger
      fireEvent.wheel(wrapperDiv, {
        deltaX: 150, // Below custom threshold of 200
        deltaY: 10,
      })

      expect(mockOnSwipeLeft).not.toHaveBeenCalled()
      expect(mockOnSwipeRight).not.toHaveBeenCalled()

      // Swipe above custom threshold should trigger
      fireEvent.wheel(wrapperDiv, {
        deltaX: 250, // Above custom threshold of 200
        deltaY: 10,
      })

      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)
    })

    it('should ignore vertical scrolling when deltaY > deltaX', () => {
      const { container } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
      const wrapperDiv = container.firstChild as HTMLElement

      // Simulate vertical scroll (deltaY > deltaX)
      fireEvent.wheel(wrapperDiv, {
        deltaX: 50,
        deltaY: 150, // Greater than deltaX
      })

      expect(mockOnSwipeLeft).not.toHaveBeenCalled()
      expect(mockOnSwipeRight).not.toHaveBeenCalled()
    })

    it('should accumulate multiple wheel events for single gesture', () => {
      const { container } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
      const wrapperDiv = container.firstChild as HTMLElement

      // Multiple small movements that accumulate to trigger
      fireEvent.wheel(wrapperDiv, { deltaX: 40, deltaY: 5 })
      fireEvent.wheel(wrapperDiv, { deltaX: 35, deltaY: 5 })
      fireEvent.wheel(wrapperDiv, { deltaX: 30, deltaY: 5 })

      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)
    })

    it('should not trigger multiple times in same gesture', () => {
      const { container } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
      const wrapperDiv = container.firstChild as HTMLElement

      // First trigger
      fireEvent.wheel(wrapperDiv, { deltaX: 120, deltaY: 10 })
      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)

      // Additional movements in same gesture should not trigger again
      fireEvent.wheel(wrapperDiv, { deltaX: 50, deltaY: 10 })
      fireEvent.wheel(wrapperDiv, { deltaX: 30, deltaY: 10 })

      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)
    })
  })

  describe('Gesture Reset Logic', () => {
    it('should reset gesture state after timeout', async () => {
      const { container } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
      const wrapperDiv = container.firstChild as HTMLElement

      // First gesture
      fireEvent.wheel(wrapperDiv, { deltaX: 120, deltaY: 10 })
      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)

      // Advance timers to trigger reset
      act(() => {
        jest.advanceTimersByTime(100) // RESET_TIMEOUT_MS
      })

      // New gesture should work again
      fireEvent.wheel(wrapperDiv, { deltaX: 120, deltaY: 10 })
      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(2)
    })

    it('should detect direction change and reset for new gesture', () => {
      const { container } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
      const wrapperDiv = container.firstChild as HTMLElement

      // First complete gesture: establish direction and trigger
      fireEvent.wheel(wrapperDiv, { deltaX: 120, deltaY: 10 })
      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)

      // Change direction - should reset and allow new gesture
      fireEvent.wheel(wrapperDiv, { deltaX: -120, deltaY: 10 })
      expect(mockOnSwipeRight).toHaveBeenCalledTimes(1)
    })

    it('should detect magnitude increase after decrease and reset gesture', () => {
      const { container } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
      const wrapperDiv = container.firstChild as HTMLElement

      // First gesture - trigger
      fireEvent.wheel(wrapperDiv, { deltaX: 120, deltaY: 10 })
      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)

      // Decreasing magnitude significantly
      fireEvent.wheel(wrapperDiv, { deltaX: 50, deltaY: 10 })
      fireEvent.wheel(wrapperDiv, { deltaX: 20, deltaY: 10 })

      // Significant magnitude increase (new gesture detected)
      // 120 > 20 and 20 < 120 * 0.225 (20 < 27) ✓
      fireEvent.wheel(wrapperDiv, { deltaX: 120, deltaY: 10 })
      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(2)
    })
  })

  describe('Optional Callbacks', () => {
    it('should work when onSwipeLeft is not provided', () => {
      const { container } = render(
        <SwipeWrapper onSwipeRight={mockOnSwipeRight}>
          <div data-qa="test-content">Test Content</div>
        </SwipeWrapper>
      )
      const wrapperDiv = container.firstChild as HTMLElement

      // Should not throw error when onSwipeLeft is undefined
      expect(() => {
        fireEvent.wheel(wrapperDiv, { deltaX: 120, deltaY: 10 })
      }).not.toThrow()

      expect(mockOnSwipeRight).not.toHaveBeenCalled()
    })

    it('should work when onSwipeRight is not provided', () => {
      const { container } = render(
        <SwipeWrapper onSwipeLeft={mockOnSwipeLeft}>
          <div data-qa="test-content">Test Content</div>
        </SwipeWrapper>
      )
      const wrapperDiv = container.firstChild as HTMLElement

      // Should not throw error when onSwipeRight is undefined
      expect(() => {
        fireEvent.wheel(wrapperDiv, { deltaX: -120, deltaY: 10 })
      }).not.toThrow()

      expect(mockOnSwipeLeft).not.toHaveBeenCalled()
    })

    it('should work when neither callback is provided', () => {
      const { container } = render(
        <SwipeWrapper>
          <div data-qa="test-content">Test Content</div>
        </SwipeWrapper>
      )
      const wrapperDiv = container.firstChild as HTMLElement

      // Should not throw error when both callbacks are undefined
      expect(() => {
        fireEvent.wheel(wrapperDiv, { deltaX: 120, deltaY: 10 })
        fireEvent.wheel(wrapperDiv, { deltaX: -120, deltaY: 10 })
      }).not.toThrow()
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero deltaX values', () => {
      const { container } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
      const wrapperDiv = container.firstChild as HTMLElement

      fireEvent.wheel(wrapperDiv, { deltaX: 0, deltaY: 0 })

      expect(mockOnSwipeLeft).not.toHaveBeenCalled()
      expect(mockOnSwipeRight).not.toHaveBeenCalled()
    })
  })

  describe('Component Lifecycle', () => {
    it('should cleanup timeout on unmount', () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
      const { container, unmount } = render(
        <SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>
      )
      const wrapperDiv = container.firstChild as HTMLElement

      // Create a timeout by triggering a wheel event
      fireEvent.wheel(wrapperDiv, { deltaX: 50, deltaY: 10 })

      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()
      clearTimeoutSpy.mockRestore()
    })

    it('should maintain gesture state across re-renders', () => {
      const { container, rerender } = render(
        <SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>
      )
      const wrapperDiv = container.firstChild as HTMLElement

      // Start accumulating
      fireEvent.wheel(wrapperDiv, { deltaX: 50, deltaY: 10 })

      // Re-render with different children
      rerender(
        <SwipeWrapper {...defaultProps}>
          <div data-qa="new-content">New Content</div>
        </SwipeWrapper>
      )

      // Continue accumulating - should still trigger
      fireEvent.wheel(wrapperDiv, { deltaX: 60, deltaY: 10 })

      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)
    })
  })

  describe('Constants and Thresholds', () => {
    it('should use correct default threshold value', () => {
      const { container } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
      const wrapperDiv = container.firstChild as HTMLElement

      // Just at default threshold (100) - should not trigger
      fireEvent.wheel(wrapperDiv, { deltaX: 100, deltaY: 10 })
      expect(mockOnSwipeLeft).not.toHaveBeenCalled()
    })

    it('should trigger when exceeding default threshold', () => {
      const { container } = render(<SwipeWrapper {...defaultProps}>{testChildren}</SwipeWrapper>)
      const wrapperDiv = container.firstChild as HTMLElement

      // Just above default threshold (101) - should trigger
      fireEvent.wheel(wrapperDiv, { deltaX: 101, deltaY: 10 })
      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)
    })

    it('should handle threshold of 0', () => {
      const { container } = render(
        <SwipeWrapper {...defaultProps} threshold={0}>
          {testChildren}
        </SwipeWrapper>
      )
      const wrapperDiv = container.firstChild as HTMLElement

      // Any horizontal movement should trigger immediately
      fireEvent.wheel(wrapperDiv, { deltaX: 1, deltaY: 0 })
      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)
    })

    it('should handle very high threshold values', () => {
      const { container } = render(
        <SwipeWrapper {...defaultProps} threshold={1000}>
          {testChildren}
        </SwipeWrapper>
      )
      const wrapperDiv = container.firstChild as HTMLElement

      // Large movement below high threshold
      fireEvent.wheel(wrapperDiv, { deltaX: 500, deltaY: 10 })
      expect(mockOnSwipeLeft).not.toHaveBeenCalled()

      // Movement above high threshold
      fireEvent.wheel(wrapperDiv, { deltaX: 600, deltaY: 10 })
      expect(mockOnSwipeLeft).toHaveBeenCalledTimes(1)
    })
  })
})
