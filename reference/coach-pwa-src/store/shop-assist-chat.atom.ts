import { atomWithStorage } from 'jotai/utils'
import {
  STORAGE_CHAT_LAUNCHER_TEXT_COLLAPSED,
  STORAGE_CHAT_LAUNCHER_TOOLTIP_DISMISSED,
  STORAGE_SHOP_ASSIST_CHAT_STATE,
  STORAGE_SHOP_ASSIST_STICKY_AI_CHAT,
} from 'toro/constants/storageIds'
import { ChatMessageType } from 'toro/components/ShopAssistChat/types'
import { atom } from 'jotai'
import type { Getter, PrimitiveAtom, Setter } from 'jotai'

export type StoredChatMessage = {
  id: string
  /** Agent analytics_message_id from the stream (eventData.client_metadata.analytics_message_id). */
  agentMessageId?: number
  timestamp: string
  type: ChatMessageType
  content?: string
  toolName?: string
  products?: any[]
  product?: any
  productImages?: string[]
  suggestedReplies?: string[]
  feedback?: 'thumbs_up' | 'thumbs_down' | null
}

export type StoredChatSession = {
  messages: StoredChatMessage[]
}

export type StoredChatState = {
  activeSessionId: string | null
  sessions: Record<string, StoredChatSession>
}

const defaultState: StoredChatState = {
  activeSessionId: null,
  sessions: {},
}

export const shopAssistChatStateAtom = atomWithStorage<StoredChatState>(
  STORAGE_SHOP_ASSIST_CHAT_STATE,
  defaultState
)

export const chatLauncherTextCollapsedAtom = atomWithStorage<boolean>(
  STORAGE_CHAT_LAUNCHER_TEXT_COLLAPSED,
  false
)

export const chatLauncherTooltipDismissedAtom = atomWithStorage<boolean>(
  STORAGE_CHAT_LAUNCHER_TOOLTIP_DISMISSED,
  false
)

export const activeMessageIdAtom = atom<string>('')

export const setActiveMessageIdAtom = atom(null, (_get, set, messageId: string) => {
  set(activeMessageIdAtom, messageId)
})
export const setMessageFeedbackSetter = (
  get: Getter,
  set: Setter,
  {
    sessionId,
    messageId,
    feedback,
  }: {
    sessionId: string
    messageId?: string
    feedback: 'thumbs_up' | 'thumbs_down' | null
  }
) => {
  const state = get(shopAssistChatStateAtom)
  const session = state?.sessions[sessionId]
  if (!session) return

  const messages = session?.messages
  const index = messages.findIndex((m) => m.id === messageId)
  if (index === -1) return

  if (messages[index]?.feedback === feedback) return

  set(shopAssistChatStateAtom, {
    ...state,
    sessions: {
      ...state.sessions,
      [sessionId]: {
        ...session,
        messages: messages.map((msg, i) => (i === index ? { ...msg, feedback } : msg)),
      },
    },
  })
}

export const setMessageFeedbackAtom = atom(null, setMessageFeedbackSetter)

/** null = closed. string = open with event location for analytics. */
export const openShopAssistChatRequestAtom = atom<string | null>(null) as PrimitiveAtom<
  string | null
>

export const setOpenShopAssistChatRequestAtom = atom(
  null,
  (_get, set, eventLocation: string | null | undefined) => {
    set(openShopAssistChatRequestAtom, eventLocation === null ? null : eventLocation ?? 'unknown')
    if (eventLocation !== null) {
      set(stickyAiChatAtom, true)
    }
  }
)

export const shopAssistAnimationSeenAtom = atomWithStorage<boolean>(
  'shopAssistAnimationSeen',
  false
)
export const stickyAiChatAtom = atomWithStorage<boolean>(STORAGE_SHOP_ASSIST_STICKY_AI_CHAT, false)

export const SHOP_ASSIST_PRODUCT_CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes

export const MAX_SHOP_ASSIST_CACHE_ENTRIES = 10

export type ShopAssistProductCacheEntry = {
  data: any[]
  expiresAt: number
}

/** Cache for fetchFullProductsDataFromClient responses, keyed by productId-locale. Each entry expires after 15 mins. */
export const shopAssistProductDataCacheAtom = atom<Map<string, ShopAssistProductCacheEntry>>(
  new Map()
)

export const isShopAssistProductCacheEntryExpired = (entry: ShopAssistProductCacheEntry): boolean =>
  Date.now() >= entry.expiresAt
