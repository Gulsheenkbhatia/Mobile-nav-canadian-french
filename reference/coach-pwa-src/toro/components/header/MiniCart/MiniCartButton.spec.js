jest.mock('toro/hooks/useShoppingGivesTrackingInstance')
import useShoppingGivesTrackingInstance from 'toro/hooks/useShoppingGivesTrackingInstance'
import MiniCartButton from 'toro/components/header/MiniCart/MiniCartButton'
import { render, waitFor } from 'test-utils/react'
import { mockLocation } from 'test-utils/mock-utils'

mockLocation()

jest.mock('next/navigation', () => {
  return {
    usePathname: () => '/mocked-path',
  }
})

const createTrackingInstanceMock = jest.fn().mockReturnValue(Promise.resolve())
useShoppingGivesTrackingInstance.mockImplementation(() => ({
  createTrackingInstance: createTrackingInstanceMock,
}))

const defaultProps = {
  productItems: [
    {
      c_customizerParentId: true,
      quantity: 1,
    },
    {
      quantity: 3,
    },
    {
      quantity: 2,
    },
  ],
  setIsHoveredOnMiniCart: jest.fn(),
}

const renderOptions = {
  contexts: {
    PWAContext: {},
    ViewportContext: {},
    AnalyticsContext: {},
  },
}

const makeSetup = (props = {}, customRenderOptions) => {
  const component = <MiniCartButton {...defaultProps} {...props} />
  return render(component, customRenderOptions || renderOptions)
}

describe('MiniCartButton tests', () => {
  it('Should render button with total quantity and link', () => {
    const { getByText, getByTestId } = makeSetup()

    getByText('5')

    const link = getByTestId('m_hdr_icon_minicart')
    expect(link?.getAttribute('href')).toEqual('/shopping-bag')
  })
  it('Should handle mouse enter', async () => {
    const { user, container } = makeSetup()
    const iconContainer = container.querySelector('.bag-icon-container')
    await user.hover(iconContainer)

    expect(defaultProps.setIsHoveredOnMiniCart).toHaveBeenCalledWith(true)
  })
  it('Should handle mouse leave', async () => {
    const { user, container } = makeSetup()
    const iconContainer = container.querySelector('.bag-icon-container')
    await user.hover(iconContainer)
    await user.unhover(iconContainer)

    expect(defaultProps.setIsHoveredOnMiniCart).toHaveBeenCalledWith(false)
  })
  it('Should handle click', async () => {
    const { user, container, getContextValue } = makeSetup()
    const iconContainer = container.querySelector('.bag-icon-container')
    await user.click(iconContainer)

    const analyticsSend = getContextValue('AnalyticsContext.send')
    expect(analyticsSend).toHaveBeenCalledWith('navClick', {
      eventLocation: 'utility',
      text: 'minicart',
    })

    await waitFor(() => expect(createTrackingInstanceMock).toHaveBeenCalled())
    expect(window.location.href).toBe('/shopping-bag')
  })
})
