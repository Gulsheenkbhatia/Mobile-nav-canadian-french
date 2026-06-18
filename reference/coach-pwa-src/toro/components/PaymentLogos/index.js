import React from 'react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import HtmlContent from 'toro/components/HtmlContent'
import Head from 'next/head'

function PaymentLogos({ html, script }) {
  return (
    <>
      {script && (
        <Head>
          <script dangerouslySetInnerHTML={{ __html: script }} key="buyer-script" defer></script>
        </Head>
      )}
      <HtmlContent content={html} />
    </>
  )
}

export default withErrorBoundaryWrapper(PaymentLogos)
