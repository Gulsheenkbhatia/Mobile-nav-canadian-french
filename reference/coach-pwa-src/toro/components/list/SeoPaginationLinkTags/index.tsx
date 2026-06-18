import { memo } from 'react'
import Head from 'next/head'
import { useAtomValue } from 'jotai/utils'
import { adjacentPageUrlsAtom } from 'store/search-results.atom'

function compileUrl(path: string, querySearchParams: URLSearchParams): string {
  const queryString = querySearchParams.toString()
  return `${path}${queryString ? `?${queryString}` : ''}`
}

function addStartFromParam(url: string): string {
  if (!url) return
  const [path, queryStr] = url.split('?')
  const querySearchParams = new URLSearchParams(queryStr)
  const pageNum = Number(querySearchParams.get('page')) || 1
  if (pageNum > 1) {
    querySearchParams.set('startFrom', `${pageNum}`)
  }

  return compileUrl(path, querySearchParams)
}

function SeoPaginationLinkTags(): JSX.Element {
  const { nextUrl, prevUrl } = useAtomValue(adjacentPageUrlsAtom)

  const prevPageUrl = addStartFromParam(prevUrl)
  const nextPageUrl = addStartFromParam(nextUrl)

  return (
    <Head>
      {prevPageUrl && <link rel="prev" href={prevPageUrl} />}
      {nextPageUrl && <link rel="next" href={nextPageUrl} />}
    </Head>
  )
}

export default memo(SeoPaginationLinkTags)
