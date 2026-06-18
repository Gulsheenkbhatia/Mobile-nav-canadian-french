import { FC, useMemo, memo } from 'react'
import { getCategoriesByCgIds } from 'toro/helpers/menu'
import { MenuData } from 'store/menu-data.atom'
import Head from 'next/head'

type SiteNavigationElementSchemaProps = {
  menuData?: MenuData
  backendDomain: string
}

const SiteNavigationElementSchema: FC<SiteNavigationElementSchemaProps> = ({
  menuData,
  backendDomain,
}) => {
  const t1Categories = useMemo(
    () => getCategoriesByCgIds(menuData, menuData?.topCategories),
    [menuData]
  )

  const schema = t1Categories.map((category) => ({
    '@context': 'http://schema.org',
    '@type': 'siteNavigationElement',
    name: category?.name,
    url: category?.url?.includes(backendDomain)
      ? category?.url
      : `https://${backendDomain}${category?.url}`,
  }))

  return (
    <Head>
      <script
        data-qa="seo-site-navigation-element"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  )
}

export default memo(SiteNavigationElementSchema)
