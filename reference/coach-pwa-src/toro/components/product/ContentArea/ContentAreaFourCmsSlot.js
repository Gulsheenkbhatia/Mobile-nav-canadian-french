import HtmlContent from 'toro/components/HtmlContent'

function ContentAreaFourCmsSlot({ html }) {
  return <HtmlContent content={html} lazyLoadVideos lazyLoadImages />
}

export default ContentAreaFourCmsSlot
