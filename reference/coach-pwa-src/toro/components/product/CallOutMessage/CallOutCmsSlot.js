import React from 'react'
import HtmlContent from 'toro/components/HtmlContent'
import useTheme from 'toro/hooks/useTheme'
import isSW from 'toro/helpers/isSW'

function CallOutCmsSlot({ text, spanText, mainHtml, promoStyle, ...props }) {
  const theme = useTheme()
  const isSWBrand = isSW()

  if (isSWBrand) {
    return (
      <HtmlContent
        content={!text && !mainHtml ? spanText : mainHtml}
        sx={{ fontSize: theme.fontSizes.xs }}
        data-qa={props?.qatag}
        {...props}
      />
    )
  }

  return (
    <>
      {text && !promoStyle && (
        <span data-qa={props?.qatag} dangerouslySetInnerHTML={{ __html: text }} />
      )}
      {text && promoStyle && (
        <HtmlContent content={mainHtml} sx={{ fontSize: theme.fontSizes.xs }} {...props} />
      )}
      {!text && !mainHtml && spanText && (
        <HtmlContent content={spanText} sx={{ fontSize: theme.fontSizes.xs }} {...props} />
      )}
    </>
  )
}

export default CallOutCmsSlot
