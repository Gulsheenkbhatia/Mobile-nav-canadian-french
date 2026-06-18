import React from 'react'
import HtmlContent from 'toro/components/HtmlContent'

function ContentAreaOneCmsSlot({ html, ...props }) {
  return <HtmlContent content={html} lazyLoadVideos lazyLoadImages {...props} />
}

export default ContentAreaOneCmsSlot
