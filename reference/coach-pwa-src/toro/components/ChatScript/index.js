import dynamic from 'next/dynamic'
import usePreference from 'toro/hooks/usePreference_new'

const LiveChatScript = dynamic(() => import('toro/components/LiveChat/liveChatScript'), {
  ssr: false,
})
const InsideChatScript = dynamic(() => import('toro/components/InsideChatScript'), {
  ssr: false,
})

export default function ChatScript() {
  const {
    insideChat: { enableInsideChat = false, insideScript = '' },
  } = usePreference({
    insideChat: ['enableInsideChat', 'insideScript'],
  })
  if (enableInsideChat && Boolean(insideScript)) {
    return <InsideChatScript insideScript={insideScript} />
  }
  return <LiveChatScript />
}
