import HtmlContent from 'toro/components/HtmlContent'
import get from 'lodash/get'

export default function NavMobileContent({ content }) {
  const markup = get(content, 'content', '')

  return (
    <HtmlContent
      sx={{
        '& img': {
          display: 'inline',
        },
      }}
      className="menumobile-additional-content"
      content={markup}
    />
  )
}
