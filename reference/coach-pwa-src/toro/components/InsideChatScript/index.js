import Script from 'next/script'

const InsideChatScript = ({ insideScript }) => (
  <Script id="inside-chat-script" strategy="lazyOnload">
    {insideScript}
  </Script>
)

export default InsideChatScript
