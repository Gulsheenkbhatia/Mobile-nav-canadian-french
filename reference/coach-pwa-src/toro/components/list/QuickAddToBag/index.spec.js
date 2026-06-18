import { render } from 'test-utils/react'
import QuickAddToBag from './index'
import * as utils from 'jotai/utils'

jest.mock('toro/hooks/useViewportType', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ isMobile: true }),
}))

describe('QuickAddToBag component', () => {
  it('renders correctly when isProductSet is true', () => {
    render(<QuickAddToBag isProductSet={true} />)

    expect(document.querySelector(`[data-qa='bundle_product']`)).toBeInTheDocument()
  })

  it('renders correctly when either of them isPlpV3 || isPlpV3 is true', () => {
    jest.spyOn(utils, 'useAtomValue').mockReturnValueOnce(true)
    jest.spyOn(utils, 'useAtomValue').mockReturnValueOnce(false)

    const { container } = render(<QuickAddToBag />)
    const plpV2OrV3Atc = container.querySelector('.plpV2OrV3Atc')

    expect(plpV2OrV3Atc).toBeInTheDocument()
  })

  it('renders correctly when both of them isPlpV3 || isPlpV3 is false', () => {
    jest.spyOn(utils, 'useAtomValue').mockReturnValueOnce(false)
    jest.spyOn(utils, 'useAtomValue').mockReturnValueOnce(false)

    const { container } = render(<QuickAddToBag />)
    const addToBag = container.querySelector('.addToBag')

    expect(addToBag).toBeInTheDocument()
  })

  it('calls onClick handler when button is clicked', async () => {
    const onClick = jest.fn()
    const { user, getByRole } = render(<QuickAddToBag onClick={onClick} />)

    await user.click(getByRole('button'))

    expect(onClick).toHaveBeenCalled()
  })

  it('disables button when disabled prop is true', () => {
    const { getByRole } = render(<QuickAddToBag disabled={true} />)
    const button = getByRole('button')
    expect(button).toBeDisabled()
  })
})
