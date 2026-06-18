import React from 'react'
import Head from 'next/head'
import usePageType from 'toro/hooks/usePageType'

export default function Preconnects({ urls = [], cmsUrl = '', imageDomain = '' }) {
  const { isHP } = usePageType()

  const filteredUrls = [...urls, isHP && cmsUrl, !isHP && imageDomain]

  return (
    <Head>
      {filteredUrls.filter(Boolean).map((url) => (
        <link rel="preconnect" href={url} key={url} crossOrigin="anonymous" />
      ))}
    </Head>
  )
}
