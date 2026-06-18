import Head from 'next/head'

export default function ItemLists({ seoProductsMetaData = '' }) {
  if (!seoProductsMetaData) {
    return null
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: seoProductsMetaData }}
      ></script>
    </Head>
  )
}
