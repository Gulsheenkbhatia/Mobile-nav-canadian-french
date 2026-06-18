import React from 'react'
import HtmlContent from 'toro/components/HtmlContent'

function ContentAreaTwoCmsSlot({ html }) {
  return <HtmlContent content={html} lazyLoadVideos lazyLoadImages />
}

export default ContentAreaTwoCmsSlot
