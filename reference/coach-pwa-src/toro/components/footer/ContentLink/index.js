import isNil from 'lodash/isNil'
import Box from 'toro/components/Box'
import Link from 'toro/components/Link'

const ContentLink = ({
  text,
  href,
  handleFeedbackButton,
  handleStylingChat,
  handleLinkClick,
  target,
  children,
  rel,
  ...rest
}) => {
  if (isNil(text) || text.toUpperCase() === 'FEEDBACK') {
    return (
      <Box {...rest} onClick={() => handleFeedbackButton(text)}>
        {children}
      </Box>
    )
  }
  if (text.toLowerCase().startsWith('chat with')) {
    return (
      <Box {...rest} onClick={handleStylingChat}>
        {children}
      </Box>
    )
  }
  return (
    <Link
      href={href}
      {...(target ? { target } : {})}
      {...(rel ? { rel } : {})}
      {...rest}
      onClick={handleLinkClick({ text, href, target })}
    >
      {children}
    </Link>
  )
}

export default ContentLink
