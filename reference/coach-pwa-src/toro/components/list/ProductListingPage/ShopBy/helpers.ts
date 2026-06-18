import { useEffect, useState } from 'react'
import { PAGE_TYPES } from 'toro/constants/googleAnalytics'
import useAnalytics from 'toro/analytics/useAnalytics'
import get from 'lodash/get'

export function usePaginatedProducts(sectionData) {
  const analytics = useAnalytics()
  const [products, setProducts] = useState(sectionData.products)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const totalPages = get(sectionData, 'totalPages', 0)
  const sectionTitle = get(sectionData, 'sectionTitle', '')
  const hasMorePages = page < totalPages

  async function loadMoreProducts() {
    try {
      setIsLoading(true)

      const nextPage = page + 1
      const url = `${sectionData.apiUrl}&page=${nextPage}`
      const response = await fetch(url)
      const data = await response.json()

      const newerProducts = get(data, 'pageData.products', [])

      setProducts((previousProducts) => [...previousProducts, ...newerProducts])
      setPage(nextPage)
      setIsLoading(false)

      analytics.send('listInteraction', {
        eventAction: 'category landing cta click',
        eventLabel: `View All ${sectionTitle}`,
        eventLocation: PAGE_TYPES.ShopByPage,
      })
    } catch (e) {
      setIsLoading(false)
      console.error('Error fetching more products', e)
    }
  }

  useEffect(() => {
    // Reset local state
    setProducts(sectionData.products)
    setPage(1)
  }, [sectionData.products])

  return { products, loadMoreProducts, hasMorePages, isLoading }
}
