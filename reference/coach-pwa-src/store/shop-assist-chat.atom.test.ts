import React from 'react'
import { render, screen } from 'test-utils/react'
import { Provider } from 'jotai'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import {
  SHOP_ASSIST_PRODUCT_CACHE_TTL_MS,
  isShopAssistProductCacheEntryExpired,
  setOpenShopAssistChatRequestAtom,
  stickyAiChatAtom,
  type ShopAssistProductCacheEntry,
} from 'store/shop-assist-chat.atom'
import { STORAGE_SHOP_ASSIST_STICKY_AI_CHAT } from 'toro/constants/storageIds'

function SetterTester() {
  const stickyAiChat = useAtomValue(stickyAiChatAtom)
  const setOpenRequest = useUpdateAtom(setOpenShopAssistChatRequestAtom)
  return React.createElement(
    'div',
    null,
    React.createElement('span', { 'data-qa': 'sticky-value' }, String(stickyAiChat)),
    React.createElement(
      'button',
      { type: 'button', onClick: () => setOpenRequest('test-location') },
      'Open'
    )
  )
}

describe('shop-assist-chat.atom', () => {
  describe('SHOP_ASSIST_PRODUCT_CACHE_TTL_MS', () => {
    it('should be 15 minutes in milliseconds', () => {
      expect(SHOP_ASSIST_PRODUCT_CACHE_TTL_MS).toBe(15 * 60 * 1000)
    })
  })

  describe('isShopAssistProductCacheEntryExpired', () => {
    it('should return true when expiresAt is in the past', () => {
      const entry: ShopAssistProductCacheEntry = {
        data: [],
        expiresAt: Date.now() - 1000,
      }
      expect(isShopAssistProductCacheEntryExpired(entry)).toBe(true)
    })

    it('should return true when expiresAt equals now', () => {
      const now = Date.now()
      const entry: ShopAssistProductCacheEntry = {
        data: [],
        expiresAt: now,
      }
      expect(isShopAssistProductCacheEntryExpired(entry)).toBe(true)
    })

    it('should return false when expiresAt is in the future', () => {
      const entry: ShopAssistProductCacheEntry = {
        data: [],
        expiresAt: Date.now() + 60000,
      }
      expect(isShopAssistProductCacheEntryExpired(entry)).toBe(false)
    })
  })

  describe('setOpenShopAssistChatRequestAtom', () => {
    beforeEach(() => {
      localStorage.removeItem(STORAGE_SHOP_ASSIST_STICKY_AI_CHAT)
    })

    it('should set stickyAiChatAtom to true when eventLocation is non-null', async () => {
      const { user } = render(
        React.createElement(Provider, null, React.createElement(SetterTester))
      )

      expect(screen.getByTestId('sticky-value')).toHaveTextContent('false')

      await user.click(screen.getByRole('button', { name: /Open/i }))

      expect(screen.getByTestId('sticky-value')).toHaveTextContent('true')
    })
  })
})
