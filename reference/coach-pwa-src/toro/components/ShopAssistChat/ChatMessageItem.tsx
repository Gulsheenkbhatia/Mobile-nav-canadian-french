import { useIntl } from 'react-intl'
import isEmpty from 'lodash/isEmpty'
import { useEffect } from 'react'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import ProductImageGallery from 'toro/components/ShopAssistChat/ProductImageGallery'
import ResponseFeedback from 'toro/components/ShopAssistChat/ResponseFeedback'
import useStyles from 'toro/hooks/useStyles'
import { type ChatMessageItemProps } from 'toro/components/ShopAssistChat/types'
import ChatError from 'toro/components/ShopAssistChat/ChatError'
import { setActiveMessageIdAtom, shopAssistChatStateAtom } from 'store/shop-assist-chat.atom'
import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { ProductTileRenderer } from 'toro/components/ShopAssistChat/ProductTileRenderer'
import PromptTile from 'toro/components/ShopAssistChat/PromptTile'

const ChatMessageItem = ({ message, isLast, onSuggestedReply }: ChatMessageItemProps) => {
  const { formatMessage } = useIntl()
  const styles = useStyles()
  const { activeSessionId, sessions } = useAtomValue(shopAssistChatStateAtom)
  const setErrorMessageId = useUpdateAtom(setActiveMessageIdAtom)
  const activeSession = sessions[activeSessionId]

  const isUser = message.type === 'user'
  const isTool = message.type === 'tool-use'
  const isProductResults = message.type === 'product-results'
  const isProductImages = message.type === 'product-images'
  const isProductTile = message.type === 'product-tile'
  const isSuggestedReplies = message.type === 'suggested-replies'
  const isError = message.type === 'error'

  const hasAssistantMessage =
    activeSession?.messages?.some((msg) => msg?.type === 'assistant') ?? false

  const productList = Array.isArray(message?.product)
    ? message?.product
    : message?.product
    ? [message?.product]
    : []

  const hideBubble = isProductImages || isProductTile || isSuggestedReplies

  useEffect(() => {
    if (isError && hasAssistantMessage) {
      setErrorMessageId(message?.id)
    }
  }, [isError, message?.id, setErrorMessageId])

  if (isError && hasAssistantMessage) {
    return (
      <ChatError
        errorMessage={message?.errorMessage}
        buttonLabel={formatMessage({
          id: 'shopAssistChat.error.retry',
          defaultMessage: 'Retry',
        })}
        canRetry={message?.canRetry}
        onRetry={() => onSuggestedReply?.(message?.content ?? '', true)}
        messageId={message?.id}
      />
    )
  }

  if (isEmpty(message) || !message.type) {
    return null
  }

  return (
    <Box
      data-type={message.type}
      data-id={message.id}
      id={isUser ? `user-${message.id}` : undefined}
      sx={{
        ...styles.wrapper,
        ...(isUser ? styles.wrapperUser : styles.wrapperAssistant),
      }}
    >
      <Box
        sx={{
          ...styles.bubble,
          ...(isUser && styles.bubbleUser),
          ...(isTool && styles.bubbleTool),
          ...(isProductResults && styles.bubbleProductResults),
          ...(hideBubble && styles.bubbleTransparent),
          ...(isProductTile && styles.productTileWrapper),
        }}
      >
        {isProductImages && message?.productImages?.length ? (
          <Box sx={styles.productImagesContainer}>
            <Text sx={styles.productImagesTitle}>
              {formatMessage({
                id: 'shopAssistChat.productImages.title',
                defaultMessage: 'Product Images:',
              })}
            </Text>
            <ProductImageGallery images={message?.productImages} />
          </Box>
        ) : isProductTile && message?.product ? (
          <ProductTileRenderer products={productList} />
        ) : message?.type !== 'error' && message?.content ? (
          <Text
            data-qa={
              message?.type === 'user'
                ? 'user-sent-prompt'
                : message?.type === 'assistant'
                ? 'assistant-response-text'
                : undefined
            }
            sx={{
              ...styles.messageText,
              ...(isUser ? styles.messageTextUser : styles.messageTextAssistant),
            }}
          >
            {message.content ?? ''}
          </Text>
        ) : null}
        {isProductResults && message?.products?.length && (
          <Box sx={styles.productResults}>
            {message?.products?.slice(0, 3)?.map((product, index) => {
              const excerpt = product?.DocumentExcerpt?.Text

              return (
                <Box key={index} sx={styles.productResultItem}>
                  <Text sx={styles.productResultId}>{product?.product_id}</Text>

                  {typeof excerpt === 'string' && (
                    <Text sx={styles.productResultExcerpt}>{excerpt?.substring(0, 100)}...</Text>
                  )}

                  {typeof excerpt === 'string' && excerpt?.includes('"price"') && (
                    <Text sx={styles.productResultPriceHint}>
                      {formatMessage({
                        id: 'shopAssistChat.product.priceHint',
                        defaultMessage: 'Price info available',
                      })}
                    </Text>
                  )}
                </Box>
              )
            })}

            {message?.products?.length > 3 && (
              <Text sx={styles.moreProducts}>
                {formatMessage(
                  {
                    id: 'shopAssistChat.product.more',
                    defaultMessage: '+{count} more products',
                  },
                  { count: message.products.length - 3 }
                )}
              </Text>
            )}
          </Box>
        )}

        {isLast && isSuggestedReplies && message?.suggestedReplies?.length > 0 && (
          <>
            <Box sx={styles.promptSuggestionsWrapper}>
              {message.suggestedReplies.map((reply, index) => (
                <PromptTile
                  key={`${message.id}-prompt-${index}`}
                  label={reply}
                  onClick={() => onSuggestedReply?.(reply)}
                />
              ))}
            </Box>
            <ResponseFeedback messageId={message?.id} />
          </>
        )}
      </Box>
    </Box>
  )
}

export default ChatMessageItem
