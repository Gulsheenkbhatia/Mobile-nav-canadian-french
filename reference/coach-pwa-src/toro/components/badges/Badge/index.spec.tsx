import { render, screen } from 'test-utils/react'
import Badge, { BadgeProps, BadgeVariant } from 'toro/components/badges/Badge'
import useExperiment from 'toro/hooks/useExperiment'

jest.mock('toro/hooks/useExperiment')
jest.mocked(useExperiment).mockImplementation(() => false)

jest.mock('next/router', () => {
  const push = jest.fn()
  return {
    useRouter: () => ({
      push,
    }),
  }
})

const componentProps: BadgeProps = {
  badgeContentSlot: '<label>Default Badge</label> ',
  variant: BadgeVariant.OnImagePLP,
  page: 'plp',
  templateVariant: undefined,
}

const setup = (overrideProps = {}, isDesktop = false) => {
  render(<Badge {...componentProps} {...overrideProps} />, {
    contexts: {
      PWAContext: { appData: {} },
      ViewportContext: { isDesktop, isMobile: !isDesktop },
    },
  })
}

describe('Badge', () => {
  afterAll(() => {
    jest.resetAllMocks()
  })
  it('should have Monetate required classes in OnImagePlp area - mobile', () => {
    setup()
    const element = screen.getByText((_, node) => {
      return node.classList.contains('custom-badge') && node.classList.contains('plp-onImagePLP')
    })
    expect(element).toBeInTheDocument()
  })
  it('should have Monetate required classes in OnImagePlp area and PLPv3 - mobile', () => {
    setup({ templateVariant: 'onImagePLPv3' })
    const element = screen.getByText((_, node) => {
      return node.classList.contains('custom-badge') && node.classList.contains('plp-onImagePLP')
    })
    expect(element).toBeInTheDocument()
  })
  it('should have Monetate required classes in OnImagePlp area - desktop', () => {
    setup({}, true)
    const element = screen.getByText((_, node) => {
      return node.classList.contains('custom-badge') && node.classList.contains('plp-onImagePLP')
    })
    expect(element).toBeInTheDocument()
  })
  it('should have Monetate required classes in OnImagePlp area and PLPv3 - desktop', () => {
    setup({ templateVariant: 'onImagePLPv3' }, true)
    const element = screen.getByText((_, node) => {
      return node.classList.contains('custom-badge') && node.classList.contains('plp-onImagePLP')
    })
    expect(element).toBeInTheDocument()
  })
})
