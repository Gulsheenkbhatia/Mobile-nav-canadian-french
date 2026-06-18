import React from 'react'
import HtmlContent from 'toro/components/HtmlContent'

function ContentAreaThreeCmsSlot({ html }) {
  return <HtmlContent content={html} lazyLoadVideos lazyLoadImages />
}

export default ContentAreaThreeCmsSlot
