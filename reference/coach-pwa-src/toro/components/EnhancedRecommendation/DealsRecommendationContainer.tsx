import { useCallback, useEffect, useState } from 'react'
import { useAtomValue } from 'jotai/utils'
import useViewportType from 'toro/hooks/useViewportType'
import Box from 'toro/components/Box'
import dynamic from 'next/dynamic'
import { xgenClientAtom } from 'store/xgen.atom'
import { XgenContainerID } from 'toro/lib/xgen/types'
import { adaptXgenToEnhancedRecommendation, type EnhancedRecommendationScheme } from './adapters'
import { CertonaScheme } from 'store/certona-schemes.atoms'
import { categoryIdAtom } from 'store/search-results.atom'

export interface DealsRecommendationContainerProps {
  slot?: {
    filters?: Record<string, any>
    recommendations?: string
  }
  categoryId?: string
  type: string
}

const EnhancedRecommendation = dynamic(() => import('toro/components/EnhancedRecommendation'), {
  ssr: false,
})

const DEALS_PRICE = '100'

export default function DealsRecommendationContainer({ type }: DealsRecommendationContainerProps) {
  const { isMobile } = useViewportType()
  const xgenClient = useAtomValue(xgenClientAtom)
  const categoryId = useAtomValue(categoryIdAtom)
  const [xgenData, setXgenData] = useState<EnhancedRecommendationScheme | null>(null)

  const fetchXgenRecommendations = useCallback(async () => {
    if (!xgenClient || !isMobile) return

    try {
      await xgenClient.recommendations.setContext({
        price: DEALS_PRICE,
        parentCategory: categoryId,
      })
      const containerId = XgenContainerID[type]
      const rawData = await xgenClient.recommendations.getRaw(containerId)
      const matchingContainer = rawData?.containers?.find(
        (container) => container.containerId === containerId
      )

      if (matchingContainer && matchingContainer.items?.length > 0) {
        const transformedData = adaptXgenToEnhancedRecommendation(matchingContainer, type)

        setXgenData(transformedData)
      }
      // reset context value
      await xgenClient.recommendations.setContext({ price: undefined })
    } catch (error) {
      setXgenData(null)
    }
  }, [xgenClient, isMobile, type, categoryId])

  useEffect(() => {
    fetchXgenRecommendations()
  }, [fetchXgenRecommendations])

  if (!isMobile) return null

  return (
    <Box id="deals-container">
      <EnhancedRecommendation
        recommendationData={xgenData as CertonaScheme}
        variant="deals"
        label={xgenData?.explanation}
      />
    </Box>
  )
}
