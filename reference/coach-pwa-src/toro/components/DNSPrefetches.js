import React from 'react'
import Head from 'next/head'
import usePageType from 'toro/hooks/usePageType'

export default function DNSPrefetches({ urls = [], cmsUrl = '', imageDomain = '' }) {
  const { isHP } = usePageType()

  const filteredUrls = [...urls, isHP && cmsUrl, !isHP && imageDomain]

  return (
    <Head>
      {filteredUrls.filter(Boolean).map((url) => (
        <link rel="dns-prefetch" key={url} href={url} crossOrigin="anonymous" />
      ))}
    </Head>
  )
}
