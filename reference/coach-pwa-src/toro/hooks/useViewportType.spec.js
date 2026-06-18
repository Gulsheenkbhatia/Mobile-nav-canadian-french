import { renderHook } from '@testing-library/react'
import useViewportType from './useViewportType'
import MockContexts from 'test-utils/MockContexts'

jest.mock('@chakra-ui/react')

const mockContexts = MockContexts()

afterEach(() => {
  mockContexts.reset()
})

test('mobile viewport', () => {
  mockContexts.mockViewport('mobile')

  const { result } = renderHook(() => useViewportType(), {
    wrapper: mockContexts.getComponent(),
  })

  expect(result.current).toEqual({
    viewport: 'mobile',
  })
})
