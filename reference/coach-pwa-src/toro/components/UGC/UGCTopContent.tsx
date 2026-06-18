import HtmlContent from '../HtmlContent'

interface UGCTopContentProps {
  content: string
}

const UGCTopContent = ({ content }: UGCTopContentProps) => {
  return <HtmlContent content={content}></HtmlContent>
}

export default UGCTopContent
