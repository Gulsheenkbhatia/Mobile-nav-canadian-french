import React from 'react'
import HtmlContent from 'toro/components/HtmlContent'

export default function withSlotStyles(Component) {
  return (props) => (
    <>
      {!!props.styles && <HtmlContent as="style" content={props.styles} />}
      <Component {...props} />
    </>
  )
}
