import { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import UGCContainer from 'toro/components/UGC/UGCContainer'
import { UGCPageType } from 'toro/components/UGC/types'

interface UGCPortalProps {
  content: HTMLElement
  selector: string
  pageType: UGCPageType
  variant: string
}

const UGCPortal = ({
  content,
  selector = '#wyng-content',
  pageType,
  variant,
}: UGCPortalProps): ReactNode => {
  const wyngContent: HTMLElement = content?.querySelector(selector)
  if (!wyngContent || !pageType) {
    return null
  }
  return ReactDOM.createPortal(
    <UGCContainer pageType={pageType} showContentDivider={false} variant={variant} />,
    wyngContent
  )
}

export default UGCPortal
