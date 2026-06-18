import { useEffect, useState } from 'react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import HtmlContent from 'toro/components/HtmlContent'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import getUsidHeader from 'toro/helpers/getUsidHeader'

function PromoProgressBar({ productsInCart }) {
  const [promoProgressBar, setPromoProgressBar] = useState({ html: null, progress: null })
  const { progress, html } = promoProgressBar
  const style = useMultiStyleConfig('PromoProgressBar')
  const fetchProgressBarData = async () => {
    try {
      const response = await fetch('/api/get-promo-progress-bar', { headers: getUsidHeader() })
      const content = await response.json()
      setPromoProgressBar(content)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!productsInCart || productsInCart.length === 0) return
    fetchProgressBarData()
  }, [productsInCart])

  return (
    <>
      {progress && <HtmlContent sx={style.PromoProgressBar({ width: progress })} content={html} />}
    </>
  )
}

export default withErrorBoundaryWrapper(PromoProgressBar)
