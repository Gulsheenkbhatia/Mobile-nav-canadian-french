import { getSearchUrl } from 'toro/lib/sales-force-connector/utils/getUrl'
import { RecommendedSearch } from 'toro/helpers/types/recommendedSearch'

const getRawSearches = (raw: string[]): RecommendedSearch[] => {
  return raw.map((term) => ({ name: term, link: getSearchUrl(term) }))
}

export default getRawSearches
