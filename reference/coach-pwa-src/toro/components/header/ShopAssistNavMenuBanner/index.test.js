import { render, screen } from 'test-utils/react'
import { useAtomValue } from 'jotai/utils'
import ShopAssistNavMenuBanner from 'toro/components/header/ShopAssistNavMenuBanner'
import { isMobileMenuVisibleAtom } from 'store/global.atom'
import { openShopAssistChatRequestAtom } from 'store/shop-assist-chat.atom'

jest.mock('toro/hooks/useMultiStyleConfig', () => ({
  __esModule: true,
  default: jest.fn((key) =>
    key === 'Icons'
      ? { MagicIcon: () => null }
      : { bannerWrapper: {}, bannerWrapperText: {}, iconWrapper: {} }
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
      <ShopAssistNavMenuBanner />
      <AtomValueCapture />
    </>,
    {
      contexts: {
        JotaiProviderContext: defaults,
      },
    }
  )
}

describe('ShopAssistNavMenuBanner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    atomValues = {}
  })

  describe('click behavior', () => {
    it('closes the mobile menu and opens the chat when clicked', async () => {
      const { user } = renderWithAtoms()

      expect(atomValues.isMobileMenuVisible).toBe(true)
      expect(atomValues.openShopAssistChatRequest).toBeNull()

      await user.click(screen.getByTestId('open-ai-concierge-mobile-menu'))

      expect(atomValues.isMobileMenuVisible).toBe(false)
      expect(atomValues.openShopAssistChatRequest).toBe('nav')
    })
  })
})
