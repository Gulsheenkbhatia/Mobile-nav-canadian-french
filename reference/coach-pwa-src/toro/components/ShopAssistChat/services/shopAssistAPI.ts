import { streamShopAssistInvocation } from 'toro/components/ShopAssistChat/services/shopAssistStreamClient'
import type {
  ShopAssistUserContext,
  StreamHandler,
  SubmitFeedbackPayload,
} from 'toro/components/ShopAssistChat/types'
import {
  SHOP_ASSIST_API_URL_AKAMAI,
  SHOP_ASSIST_API_URL_VERCEL,
  SHOP_ASSIST_FEEDBACK_API_URL_AKAMAI,
  SHOP_ASSIST_FEEDBACK_API_URL_VERCEL,
} from 'toro/components/ShopAssistChat/constants'

const buildAkamaiUrl = (path: string, domain?: string) => {
  if (!domain) return path
  const trimmedDomain = domain.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  try {
    return new URL(normalizedPath, trimmedDomain).toString()
  } catch (error) {
    console.error('Invalid shopAssistAkamaiDomain:', error)
    return `${trimmedDomain}${normalizedPath}`
  }
}

export async function streamShopAssistResponse(
  payload: {
    prompt: string
    sessionId: string | null
    userContext: ShopAssistUserContext
    locale: string
    clientMetadata?: { analytics_message_id?: string }
  },
  onEvent: StreamHandler,
  options: {
    signal?: AbortSignal
    enableShopAssistAkamai?: boolean
    streamReadTimeoutMs?: number
    shopAssistAkamaiDomain?: string
  } = {}
) {
  const url = options.enableShopAssistAkamai
    ? buildAkamaiUrl(SHOP_ASSIST_API_URL_AKAMAI, options.shopAssistAkamaiDomain)
    : SHOP_ASSIST_API_URL_VERCEL

  await streamShopAssistInvocation(
    url,
    {
      prompt: payload.prompt,
      sessionId: payload.sessionId,
      userContext: payload.userContext,
      locale: payload.locale,
      clientMetadata: payload.clientMetadata,
    },
    {
      ignoreData: (dataStr) => dataStr.includes('text-break'),
      onEvent,
      onError: (errorPayload, error) => {
        console.error('Shop Assist API: Streaming error:', error)
        throw new Error(errorPayload.message)
      },
    },
    { signal: options.signal, streamReadTimeoutMs: options.streamReadTimeoutMs }
  )
}

export async function submitFeedback(
  payload: SubmitFeedbackPayload,
  options: { enableShopAssistAkamai?: boolean; shopAssistAkamaiDomain?: string } = {}
) {
  if (!payload.feedback || !payload.sessionId) {
    throw new Error('Missing required fields: feedback, session_id')
  }

  const url = options.enableShopAssistAkamai
    ? buildAkamaiUrl(SHOP_ASSIST_FEEDBACK_API_URL_AKAMAI, options.shopAssistAkamaiDomain)
    : SHOP_ASSIST_FEEDBACK_API_URL_VERCEL
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      feedback: payload.feedback,
      session_id: payload.sessionId,
      message_content: payload.messageContent ?? '',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Feedback submission failed: ${errorText}`)
  }
}
