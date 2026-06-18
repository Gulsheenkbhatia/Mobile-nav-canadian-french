import type { PopoverProps } from '@chakra-ui/react'
import type { MessageDescriptor } from 'react-intl'

export interface FormatMessage {
  (descriptor: MessageDescriptor): string
}

export type FeedbackValue = 'thumbs_up' | 'thumbs_down'

export type ResponseFeedbackProps = {
  messageId?: string
}

export type ChatErrorProps = {
  messageId: string
  errorMessage?: string
  buttonLabel?: string
  canRetry?: boolean
  onRetry?: () => void
}

export type Product = {
  id: string
  item_variant?: string
  masterId?: string
  image_url: string
  url: string
  title: string
  description?: string | null
  price: number
  color: string
  sale_price?: number
  category?: string
  discount_percentage?: number
  comparable_price?: number
  product_id?: number
  DocumentExcerpt?: {
    Text?: string
  }
}

export type StreamHandler = (eventData: StreamEventData) => void

export type SubmitFeedbackPayload = {
  feedback: string
  sessionId: string | null
  messageContent?: any
}

export type InvocationPayload = {
  prompt: string
  sessionId?: string | null
  userContext?: ShopAssistUserContext
  configOverrides?: Record<string, unknown>
  userId?: string
  locale?: string
  /** Sent in request as string; API echoes back in stream events for analytics_message_id tracking */
  clientMetadata?: { analytics_message_id?: string }
}

export type StreamContentItem = {
  text?: string
  toolUse?: {
    name?: string
    toolUseId?: string
  }
  toolResult?: {
    status?: string
    content?: Array<{
      text?: string
    }>
  }
  product?: Product
  product_images?: string[]
  suggested_replies?: string[]
}

export type StreamEventData = {
  event?: {
    metadata?: unknown
    contentBlockStart?: {
      start?: {
        toolUse?: {
          toolUseId?: string
          name?: string
        }
      }
    }
  }
  message?: {
    role?: 'assistant' | 'user' | string
    content?: StreamContentItem[]
    related_product_id?: string
  }
  /** @deprecated Use client_metadata.analytics_message_id instead */
  message_id?: number
  /** API echoes client_metadata from request; use analytics_message_id for agent message tracking*/
  client_metadata?: { analytics_message_id?: string }
  type?: string
  request_id?: string
  error?: string
}

export type StreamHandlers = {
  onEvent?: (eventData: StreamEventData) => void
  onData?: (data: string) => void
  onLine?: (line: string) => void
  ignoreData?: (data: string) => boolean
  parseData?: (data: string) => StreamEventData
  onError?: (payload: StreamErrorPayload, error: unknown) => void
}

export type StreamOptions = {
  signal?: AbortSignal
  fetchImpl?: typeof fetch
  headers?: Record<string, string>
  streamReadTimeoutMs?: number | string
  abortController?: AbortController
}

export type StreamErrorPayload = {
  error: 'Streaming failed'
  code?: string
  message: string
}

export type ChatMessageType =
  | 'user'
  | 'assistant'
  | 'tool-use'
  | 'product-results'
  | 'product-tile'
  | 'product-images'
  | 'suggested-replies'
  | 'error'

export type ShopAssistUserContext = {
  recent_search_queries: string[]
  recently_viewed_items: string[]
} | null

export interface ChatMessage {
  id: string
  /** Agent analytics_message_id from the stream (eventData.client_metadata.analytics_message_id). */
  agentMessageId?: number
  timestamp: Date
  type: ChatMessageType
  content?: string
  toolName?: string
  products?: Product[]
  product?: Product[]
  productImages?: string[]
  suggestedReplies?: string[]
  canRetry?: boolean
  errorMessage?: string
  source?: 'text' | 'prompt'
}

export interface ToolCallEvent {
  id: string
  toolUseId: string
  name: string
  timestamp: Date
}

export type AddMessageProps = Omit<ChatMessage, 'id' | 'timestamp'>

export type ChatMode = 'animation' | 'starter' | 'conversation'

export type ChatHeaderProps = {
  onClose: () => void
  onNew: () => void
  mode: ChatMode
}

export type ChatShellProps = {
  children: React.ReactNode
  /** When true, plays slide-down exit animation; call onCloseComplete when animation ends */
  isClosing?: boolean
  onCloseComplete?: () => void
  mode: ChatMode
}

export type ChatMessagesProps = {
  messages: ChatMessage[]
  isLoading: boolean
  onSuggestedReply: (text: string) => void
  offsets: { header: number; footer: number }
}

export type ChatIntroProps = {
  onPromptSelect: (text: string) => void
  isMessageLength: boolean
}

export type ChatMessageItemProps = {
  message: ChatMessage
  isLast: boolean
  onSuggestedReply: (text: string, skipStorage?: boolean) => void
}

export interface ThinkingIndicatorProps {
  className?: string
}

export interface ChatInputProps {
  onSend: (value: string) => void | Promise<void>
  placeholder: string
  disabled: boolean
  className?: string
  clearInput: boolean
}

export type PromptSuggestionsProps = {
  prompts: string[]
  onSelect: (text: string) => void
}

export type ChatLauncherTooltipPlacement = NonNullable<PopoverProps['placement']>

export type ChatLauncherProps = {
  onOpen: () => void
  tooltipPlacement?: ChatLauncherTooltipPlacement
}
export interface ProductImageGalleryProps {
  images: string[]
}
export type NewChatConfirmationProps = {
  isOpen: boolean
  onCancel: () => void
  onConfirm: () => void
}

export type ChatStarterLabel = {
  key: string
  defaultMessage: string
}

export type ChatStarterConfig = {
  heading: ChatStarterLabel
  subText: ChatStarterLabel
  contactCustomerCare: ChatStarterLabel
  contactUsHere: ChatStarterLabel
  privacyDetails: ChatStarterLabel
  contactCustomerCareUrl: ChatStarterLabel
  privacyUrl: ChatStarterLabel
}
