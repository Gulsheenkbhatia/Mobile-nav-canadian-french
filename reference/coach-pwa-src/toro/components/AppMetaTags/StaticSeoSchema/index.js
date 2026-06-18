import Head from 'next/head'
import get from 'lodash/get'

function StaticSeoSchema({ content }) {
  if (!content?.length) {
    return null
  }

  return (
    <Head>
      {content.map((json, idx) => {
        const type = get(json, '@type', idx)
        return (
          <script
            key={type}
            data-key={type}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
          />
        )
      })}
    </Head>
  )
}
export default StaticSeoSchema
