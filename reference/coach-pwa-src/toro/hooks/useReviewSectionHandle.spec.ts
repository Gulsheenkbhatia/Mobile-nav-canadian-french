import { renderHook } from '@testing-library/react'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import useReviewSectionHandle from 'toro/hooks/useReviewSectionHandle'
import useScrollWithHeadroomDisabled from 'toro/hooks/useScrollWithHeadroomDisabled'
import useExperiment from 'toro/hooks/useExperiment'

jest.mock('jotai/utils')
jest.mock('toro/hooks/useScrollWithHeadroomDisabled')
jest.mock('toro/hooks/useExperiment')
jest.mock('toro/hooks/useHeaderPositionPref', () => () => ({ isStickyHeader: true }))
jest.mock('store/headroom.atom', () => {
  return {
    isHeaderHeightAtom: 'isHeaderHeightAtom',
  }
})
jest.mock('store/pdp.atom', () => {
  return {
    isPaidSocialLandingAtom: 'isPaidSocialLandingAtom',
    reviewSectionNodeAtom: 'reviewSectionNodeAtom',
    setReviewModalOpenedAtom: 'setReviewModalOpenedAtom',
  }
})

const reviewSectionNode = document.createElement('div')
const mockOpenReviewModal = jest.fn()
const moockScrollIntoView = jest.fn()

const mockScrollWithHeadroomDisabled = useScrollWithHeadroomDisabled as jest.MockedFunction<
  () => () => void
>
const mockAtomValue = useAtomValue as jest.MockedFunction<any>
const mockUpdateAtom = useUpdateAtom as jest.MockedFunction<() => any>
const mockExperimentValue = useExperiment as jest.MockedFunction<() => boolean>

mockScrollWithHeadroomDisabled.mockImplementation(() => moockScrollIntoView)
mockUpdateAtom.mockImplementation(() => mockOpenReviewModal)

const mockAtomValues = (sectionNode: HTMLElement = reviewSectionNode) => {
  mockAtomValue.mockImplementation((argumentAtom: string) => {
    switch (argumentAtom) {
      case 'isHeaderHeightAtom':
        return 0
      case 'reviewSectionNodeAtom':
        return sectionNode
      default:
        return ''
    }
  })
}

const mockHookReturnValue: typeof useReviewSectionHandle = (args) => {
  const {
    result: { current: handle },
  } = renderHook(() => useReviewSectionHandle(args))
  return handle
}

describe('useReviewSectionHandle', () => {
  it('Should not interact with review section if disabled', () => {
    const handle = mockHookReturnValue({ isEnabled: false })
    handle.onClick()
    handle.onMount()
    expect(moockScrollIntoView).not.toHaveBeenCalled()
  })

  it('Should not interact with review section if it is not mounted', () => {
    mockAtomValues(null)
    const handle = mockHookReturnValue({ isEnabled: true })
    handle.onClick()
    handle.onMount()
    expect(moockScrollIntoView).not.toHaveBeenCalled()
  })

  describe('PDP v1', () => {
    beforeAll(() => {
      mockExperimentValue.mockImplementation(() => false)
      mockAtomValues()
    })

    it('Should return a handle allowing to scroll to review section on click', () => {
      const handle = mockHookReturnValue({ isEnabled: true })
      expect(handle).toHaveProperty('onClick')
      handle.onClick()
      expect(moockScrollIntoView).toHaveBeenCalledWith({ top: reviewSectionNode.offsetTop })
    })

    it('Should invoke a callback on click', () => {
      const onClickMock = jest.fn()
      const handle = mockHookReturnValue({ isEnabled: true, onClick: onClickMock })
      expect(handle).toHaveProperty('onClick')
      handle.onClick()
      expect(onClickMock).toHaveBeenCalled()
    })

    it('Should return a handle allowing to scroll to review section on component mount', () => {
      const handle = mockHookReturnValue({ isEnabled: true })
      expect(handle).toHaveProperty('onMount')
      handle.onMount()
      expect(moockScrollIntoView).toHaveBeenCalledWith({ top: reviewSectionNode.offsetTop })
    })
  })

  describe('PDP v3', () => {
    beforeAll(() => {
      mockExperimentValue.mockImplementation(() => true)
      mockAtomValues()
    })

    it('Should return a handle allowing to close review modal', () => {
      const handle = mockHookReturnValue({ isEnabled: true })
      expect(handle).toHaveProperty('closeModal')
      handle.closeModal()
      expect(mockOpenReviewModal).toHaveBeenCalledWith(false)
    })
  })
})
