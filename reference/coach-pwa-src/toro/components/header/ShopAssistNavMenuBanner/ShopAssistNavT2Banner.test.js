import { render, screen } from 'test-utils/react'
import { useAtomValue } from 'jotai/utils'
import ShopAssistNavT2Banner from 'toro/components/header/ShopAssistNavMenuBanner/ShopAssistNavT2Banner'
import { isMobileMenuVisibleAtom } from 'store/global.atom'
import { openShopAssistChatRequestAtom } from 'store/shop-assist-chat.atom'

jest.mock('toro/hooks/useMultiStyleConfig', () => ({
  __esModule: true,
  default: jest.fn((key) =>
    key === 'Icons'
      ? { MagicIcon: () => null }
      : {
          t2container: {},
          t2content: {},
          t2title: {},
          t2description: {},
          t2button: {},
        }
  ),
}))

let atomValues = {}

function AtomValueCapture() {
  atomValues = {
    isMobileMenuVisible: useAtomValue(isMobileMenuVisibleAtom),
    openShopAssistChatRequest: useAtomValue(openShopAssistChatRequestAtom),
  }
  return null
}

function renderWithAtoms(initialValues = new Map()) {
  const defaults = new Map([
    [isMobileMenuVisibleAtom, true],
    [openShopAssistChatRequestAtom, null],
  ])

  initialValues.forEach((v, k) => defaults.set(k, v))

  return render(
    <>
      <ShopAssistNavT2Banner />
      <AtomValueCapture />
    </>,
    {
      contexts: {
        JotaiProviderContext: defaults,
      },
    }
  )
}

describe('ShopAssistNavT2Banner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    atomValues = {}
  })

  describe('render', () => {
    it('renders banner content', () => {
      renderWithAtoms()

      expect(screen.getByText("Let's Find the Perfect Gift")).toBeInTheDocument()

      expect(
        screen.getByText(
          "Your personal AI gifting expert — ready to help you find something they'll truly love."
        )
      ).toBeInTheDocument()

      expect(
        screen.getByRole('button', {
          name: /find a gift they'll love/i,
        })
      ).toBeInTheDocument()
    })
  })

  describe('click behavior', () => {
    it('closes mobile menu and opens chat when CTA clicked', async () => {
      const { user } = renderWithAtoms()

      expect(atomValues.isMobileMenuVisible).toBe(true)
      expect(atomValues.openShopAssistChatRequest).toBeNull()

      await user.click(
        screen.getByRole('button', {
          name: /find a gift they'll love/i,
        })
      )

      expect(atomValues.isMobileMenuVisible).toBe(false)
      expect(atomValues.openShopAssistChatRequest).toBe('nav')
    })
  })
})
