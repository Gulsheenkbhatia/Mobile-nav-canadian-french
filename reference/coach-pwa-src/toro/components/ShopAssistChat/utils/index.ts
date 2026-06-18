type PromptLabel = {
  key: string
  defaultMessage: string
}

import { type StoredChatMessage } from 'store/shop-assist-chat.atom'
import {
  ChatStarterLabel,
  type FormatMessage,
  type ShopAssistUserContext,
} from 'toro/components/ShopAssistChat/types'
import { chatStarterConfig } from 'toro/components/ShopAssistChat/constants'

export const pickRandomItems = <T>(arr: T[], count: number): T[] => {
  if (count < 0 || arr.length === 0) return []
  if (count >= arr.length) return [...arr]
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

export const getInitialPrompts = (formatMessage: FormatMessage): string[] => [
  formatMessage({
    id: 'shopAssistChat.initialPrompts.promptOne',
    defaultMessage: 'A gift for a friend’s birthday',
  }),
  formatMessage({
    id: 'shopAssistChat.initialPrompts.promptTwo',
    defaultMessage: 'I’m on a budget but want it to feel special',
  }),
  formatMessage({
    id: 'shopAssistChat.initialPrompts.promptThree',
    defaultMessage: 'I have no idea what to get 😅',
  }),
]

export const generateSessionId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const getUserContext = (): ShopAssistUserContext => {
  try {
    let recentSearches: string[] = []
    const recentSearchesFromLocalStorage = JSON.parse(
      localStorage.getItem('recent_searches') || '{}'
    )
    if (
      typeof recentSearchesFromLocalStorage === 'object' &&
      recentSearchesFromLocalStorage !== null &&
      Object.values(recentSearchesFromLocalStorage).length > 0
    ) {
      recentSearches = Object.values(recentSearchesFromLocalStorage)
    }

    let viewedProducts: string[] = []
    const viewedProductsFromLocalStorage = JSON.parse(
      localStorage.getItem('mw_viewed_products') || '[]'
    )
    if (Array.isArray(viewedProductsFromLocalStorage)) {
      viewedProducts = viewedProductsFromLocalStorage
    }

    return {
      recent_search_queries: recentSearches,
      recently_viewed_items: viewedProducts,
    }
  } catch (error) {
    console.warn('Failed to read user context from localStorage:', error)
    return null
  }
}

export function getFeedbackContent(messages?: StoredChatMessage[]): string {
  if (!messages?.length) return ''

  const chunks: string[] = []

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    if (msg.type === 'user') break
    if (msg.type === 'assistant' && msg.content) {
      chunks.push(msg.content)
    }
  }

  return chunks.reverse().join('\n\n')
}

export const formatPrice = (
  price?: string | number | null,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  if (price === undefined || price === null || price === '') {
    return ''
  }

  const numericPrice =
    typeof price === 'number' ? price : parseFloat(String(price).replace(/[^\d.]/g, ''))

  if (isNaN(numericPrice)) {
    return ''
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,

    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(numericPrice)
}

// TODO: Keeping fallback static for now.
// SFCC-driven when giftingAssistantPromptLables is available.
// DIGIT-39759
export const getWelcomePrompts = (
  formatMessage: FormatMessage,
  giftingAssistantPromptLabels?: PromptLabel[]
): string[] => {
  const fallbackPrompts: PromptLabel[] = [
    { key: '1', defaultMessage: 'For a special occasion' },
    { key: '2', defaultMessage: 'Gift ideas for my wife' },
    { key: '3', defaultMessage: 'Trending now' },
    { key: '4', defaultMessage: 'For my best friend' },
    { key: '5', defaultMessage: 'Under $200' },
    { key: '6', defaultMessage: 'A luxury gift' },
    { key: '7', defaultMessage: 'Something under $100' },
    { key: '8', defaultMessage: 'Something unique' },
  ]

  const sourcePrompts =
    giftingAssistantPromptLabels?.length > 0 ? giftingAssistantPromptLabels : fallbackPrompts

  return sourcePrompts.map(({ key, defaultMessage }) =>
    formatMessage({
      id: `shopAssistChat.welcomePrompts.${key}`,
      defaultMessage,
    })
  )
}

export const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

export const getChatStarterMessages = (formatMessage: FormatMessage) => {
  const get = ({ key, defaultMessage }: ChatStarterLabel) =>
    formatMessage({
      id: `shopAssistChat.chatStarterScreen.${key}`,
      defaultMessage,
    })

  return {
    heading: get(chatStarterConfig.heading),
    subText: get(chatStarterConfig.subText),
    contactCustomerCare: chatStarterConfig.contactCustomerCare,
    contactUsHere: get(chatStarterConfig.contactUsHere),
    privacyDetails: get(chatStarterConfig.privacyDetails),
    contactCustomerCareUrl: get(chatStarterConfig.contactCustomerCareUrl),
    privacyUrl: get(chatStarterConfig.privacyUrl),
  }
}

export const getNormalizedPathname = (): string => window.location.pathname.replace(/\.html?$/i, '')
