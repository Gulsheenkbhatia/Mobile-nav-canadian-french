import { FC } from 'react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import HtmlContent from 'toro/components/HtmlContent'
import useProductData from 'toro/hooks/useProductData'

export enum TabbedContentAttribute {
  ONE = 'tabbedContentModule1',
  TWO = 'tabbedContentModule2',
}

interface TabbedContentModuleProps {
  moduleId: TabbedContentAttribute
}

const TabbedContentModule: FC<TabbedContentModuleProps> = ({ moduleId }) => {
  const [htmlMarkup, isOnline] = useProductData([
    `${moduleId}.c_body.default.markup`,
    `${moduleId}.online.default`,
  ])

  if (!isOnline || !htmlMarkup?.trim()) {
    return null
  }

  return (
    <HtmlContent
      content={htmlMarkup}
      data-testid={`tabbed-content-${moduleId}`}
      data-qa={`tabbed-content-${moduleId}`}
      lazyLoadImages
      lazyLoadVideos
    />
  )
}

export default withErrorBoundaryWrapper(TabbedContentModule)
