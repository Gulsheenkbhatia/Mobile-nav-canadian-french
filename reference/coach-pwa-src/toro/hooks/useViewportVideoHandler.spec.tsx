import React, { createRef } from 'react'
import { render } from 'test-utils/react'
import useViewportVideoHandler from 'toro/hooks/useViewportVideoHandler'
import useViewportType from 'toro/hooks/useViewportType'

jest.mock('toro/hooks/useViewportType')

jest.mock('toro/helpers/mediaAssets', () => ({
  onViewportChangeHandler: jest.fn(),
}))

const mockedUseViewportType = useViewportType as jest.MockedFn<typeof useViewportType>
const { onViewportChangeHandler } = jest.requireMock('toro/helpers/mediaAssets')

const TestComponent = ({ hasVideoContent = false, externalRef = null }) => {
  const refCallback = useViewportVideoHandler(hasVideoContent, externalRef)
  return (
    <div ref={refCallback} data-testid="video-container">
      <video autoPlay muted />
    </div>
  )
}

const makeSetup = (props = {}) => {
  return render(<TestComponent {...props} />)
}

describe('useViewportVideoHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedUseViewportType.mockReturnValue({ isDesktop: true })
  })

  it('calls onViewportChangeHandler when hasVideoContent = true and ref assigned', () => {
    makeSetup({ hasVideoContent: true })
    expect(onViewportChangeHandler).toHaveBeenCalledWith(true)
  })

  it('does not call onViewportChangeHandler when hasVideoContent = false', () => {
    makeSetup({ hasVideoContent: false })
    expect(onViewportChangeHandler).not.toHaveBeenCalled()
  })

  it('calls onViewportChangeHandler again when viewport changes', () => {
    const { rerender } = makeSetup({ hasVideoContent: true })
    expect(onViewportChangeHandler).toHaveBeenCalledTimes(1)

    mockedUseViewportType.mockReturnValue({ isDesktop: false })

    rerender(<TestComponent hasVideoContent={true} />)
    expect(onViewportChangeHandler).toHaveBeenCalledTimes(2)
    expect(onViewportChangeHandler).toHaveBeenLastCalledWith(false)
  })

  it('forwards the ref correctly when externalRef is an object ref', () => {
    const externalRef = createRef<HTMLDivElement>()
    makeSetup({ hasVideoContent: true, externalRef })
    expect(externalRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it('calls externalRef function when provided as a callback ref', () => {
    const mockRefFn = jest.fn()
    makeSetup({ hasVideoContent: true, externalRef: mockRefFn })
    expect(mockRefFn).toHaveBeenCalled()
    expect(mockRefFn.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement)
  })
})
