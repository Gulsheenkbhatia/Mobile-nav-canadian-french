import { render, renderHook, act, waitFor, CustomRenderOptions } from 'test-utils/react'
import MiniCartPopoverContainer from 'toro/components/header/MiniCart/MiniCartPopover.container'
import { useLoadMiniCartPopover } from 'toro/components/header/MiniCart/useLoadMiniCartPopover'
import { isLoadMiniCartPopoverAtom } from 'store/miniCartPopover.atom'
import useViewportType from 'toro/hooks/useViewportType'
import miniCartProduct from 'test-utils/MiniCartPopoverItem2.mock'
import cloneDeep from 'lodash/cloneDeep'
import { useAtom } from 'jotai'

jest.mock('toro/components/header/MiniCart/MiniCartPopover', () => ({
  __esModule: true,
  default: () => <div id="minicart">Mocked MiniCartPopover</div>,
}))

jest.mock('toro/hooks/useViewportType', function () {
  return jest.fn().mockReturnValue({ isDesktop: false })
})

const renderOptions: CustomRenderOptions = {
  contexts: {
    SessionContext: {
      session: {
        cart: {
          product_items: [miniCartProduct],
          product_total: 149,
          basket_id: 'bfe074e5e5bfbb115c9b5095a8',
        },
      },
    },
  },
}

jest.mock('jotai', () => {
  const actual = jest.requireActual('jotai')
  return {
    ...actual,
    useAtom: jest.fn(),
  }
})
const mockedUseAtom = jest.mocked(useAtom) as jest.Mock
mockedUseAtom.mockReturnValue([true, jest.fn()])

const makeMinicartPopoverContainerSetup = (customRenderOptions) => {
  return render(<MiniCartPopoverContainer />, customRenderOptions)
}

describe('MiniCartPopoverContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders MiniCartPopover when cart has products', async () => {
    const { container } = makeMinicartPopoverContainerSetup(renderOptions)
    await waitFor(() => {
      expect(container.querySelector('#minicart')).toBeVisible()
    })
  })

  it('does not render MiniCartPopover when cart is empty', () => {
    const _renderOptions = cloneDeep(renderOptions)
    _renderOptions.contexts.SessionContext.session.cart['product_items'] = []
    const { container } = makeMinicartPopoverContainerSetup(_renderOptions)

    expect(container.querySelector('#minicart-popover')).not.toBeInTheDocument()
  })

  it('does not render MiniCartPopover if isLoadMiniCartPopover is false', () => {
    const { container } = makeMinicartPopoverContainerSetup(renderOptions)

    expect(container.querySelector('#minicart-popover')).not.toBeInTheDocument()
  })
})

const makeSetup = () => {
  const { result } = renderHook(() => useLoadMiniCartPopover())
  act(() => result.current())
}

describe('useLoadMiniCartPopover', () => {
  const setLoadMiniCartPopoverSpy = jest.fn()
  beforeEach(() => {
    mockedUseAtom.mockImplementation((atom) => {
      if (atom === isLoadMiniCartPopoverAtom) {
        return [false, setLoadMiniCartPopoverSpy]
      }
      return [null, jest.fn()]
    })
  })

  it('updates isLoadMiniCartPopover to true if viewport is desktop and it is currently false', () => {
    ;(useViewportType as jest.Mock).mockReturnValue({ isDesktop: true })

    makeSetup()

    expect(setLoadMiniCartPopoverSpy).toHaveBeenCalledWith(true)
  })

  it('does not update isLoadMiniCartPopover if viewport is not desktop', () => {
    ;(useViewportType as jest.Mock).mockReturnValue({ isDesktop: false })
    makeSetup()

    expect(setLoadMiniCartPopoverSpy).not.toHaveBeenCalled()
  })

  it('does not update isLoadMiniCartPopover if isLoadMiniCartPopover is true', () => {
    ;(useViewportType as jest.Mock).mockReturnValue({ isDesktop: false })
    makeSetup()

    expect(setLoadMiniCartPopoverSpy).not.toHaveBeenCalled()
  })
})
