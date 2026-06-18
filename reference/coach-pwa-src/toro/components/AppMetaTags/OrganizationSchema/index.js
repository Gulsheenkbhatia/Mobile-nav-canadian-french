import Head from 'next/head'
import get from 'lodash/get'
import isArray from 'lodash/isArray'

import { PAGE_TYPES, SCHEMA_TYPES } from 'toro/constants/seo'

function OrganizationSchema({ content, pageType, isSubBrandHomePage = false }) {
  let jsons
  try {
    const organizationSchemaJson = JSON.parse(content)
    jsons = isArray(organizationSchemaJson) ? organizationSchemaJson : [organizationSchemaJson]

    jsons =
      pageType === PAGE_TYPES.HOME_PAGE || isSubBrandHomePage
        ? jsons
        : jsons.filter((json) =>
            [SCHEMA_TYPES.CORPORATION, SCHEMA_TYPES.ORGANIZATION].includes(json['@type'])
          )
  } catch (e) {
    jsons = []
  }

  if (!jsons.length) {
    return null
  }

  return (
    <Head>
      {jsons.map((json, idx) => (
        <script
          key={get(json, '@type', idx)}
          data-key={get(json, '@type', idx)}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
        />
      ))}
    </Head>
  )
}
export default OrganizationSchema
