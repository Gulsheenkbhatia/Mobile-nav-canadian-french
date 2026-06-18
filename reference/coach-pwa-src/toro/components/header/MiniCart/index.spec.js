jest.mock('toro/components/header/MiniCart/MiniCartButton', () => {
  const { forwardRef } = jest.requireActual('react')
  return {
    __esModule: true,
    default: forwardRef(() => 'MiniCartButton'),
  }
})
import MiniCart from 'toro/components/header/MiniCart'
import { render } from 'test-utils/react'

const defaultProps = {
  setIsMiniCartRef: jest.fn(),
  setIsHoveredOnMiniCart: jest.fn(),
}

const renderOptions = {
  contexts: {
    SessionContext: {},
  },
}

const makeSut = (props = {}) => {
  return <MiniCart {...defaultProps} {...props} />
}

describe('MiniCart tests', () => {
  it('Should render button and set ref', () => {
    const { getByText } = render(makeSut(), renderOptions)

    getByText('MiniCartButton')
    expect(defaultProps.setIsMiniCartRef).toHaveBeenCalled()
  })
})
