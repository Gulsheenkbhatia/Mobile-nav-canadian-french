import React from 'react'
import { render, screen } from 'test-utils/react'
import userEvent from '@testing-library/user-event'
import ChatMessageItem from 'toro/components/ShopAssistChat/ChatMessageItem'
import StylesProvider from 'toro/components/StylesProvider'
import { ChatMessage } from 'toro/components/ShopAssistChat/types'

jest.mock('react-intl', () => {
  const reactIntl = jest.requireActual('react-intl')
  const intl = reactIntl.createIntl({
    locale: 'en',
  })

  return {
    ...reactIntl,
    useIntl: () => intl,
  }
})

jest.mock('toro/components/ShopAssistChat/ProductImageGallery', () => ({
  __esModule: true,
  default: () => <div>ProductImageGallery</div>,
}))

jest.mock('toro/components/ShopAssistChat/PromptTile', () => ({
  __esModule: true,
  default: ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button onClick={onClick}>{label}</button>
  ),
}))

jest.mock('toro/components/ShopAssistChat/ResponseFeedback', () => ({
  __esModule: true,
  default: () => <div>ResponseFeedBack</div>,
}))

jest.mock('toro/components/Button', () => ({
  __esModule: true,
  default: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))

describe('ChatMessageItem', () => {
  const baseMessage: ChatMessage = {
    id: '1',
    type: 'assistant',
    content: 'Hello from assistant',
    timestamp: new Date('2024-01-01T10:00:00'),
  }

  it('renders normal message content', () => {
    render(
      <StylesProvider value={{}}>
        <ChatMessageItem message={baseMessage} isLast={false} onSuggestedReply={jest.fn()} />
      </StylesProvider>
    )

    expect(screen.getByText('Hello from assistant')).toBeInTheDocument()
  })

  it('renders product images when message type is product-images', () => {
    const message: ChatMessage = {
      ...baseMessage,
      type: 'product-images',
      productImages: ['img1.jpg'],
    }

    render(
      <StylesProvider value={{}}>
        <ChatMessageItem message={message} isLast={false} onSuggestedReply={jest.fn()} />
      </StylesProvider>
    )

    expect(screen.getByText('Product Images:')).toBeInTheDocument()
    expect(screen.getByText('ProductImageGallery')).toBeInTheDocument()
  })

  it('renders suggested replies and triggers callback', async () => {
    const user = userEvent.setup()
    const onSuggestedReply = jest.fn()

    const message: ChatMessage = {
      ...baseMessage,
      type: 'suggested-replies',
      suggestedReplies: ['Reply 1'],
    }

    render(
      <StylesProvider value={{}}>
        <ChatMessageItem message={message} isLast onSuggestedReply={onSuggestedReply} />
      </StylesProvider>
    )

    await user.click(screen.getByText('Reply 1'))
    expect(onSuggestedReply).toHaveBeenCalledWith('Reply 1')
    expect(screen.getByText('ResponseFeedBack')).toBeVisible()
  })
})
