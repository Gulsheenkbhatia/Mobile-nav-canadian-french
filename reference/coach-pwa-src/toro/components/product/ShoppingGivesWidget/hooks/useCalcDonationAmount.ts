import { useMemo } from 'react'

import { UseLoadShoppingGivesConfigs } from 'toro/components/product/ShoppingGivesWidget/hooks/useLoadShoppingGivesConfigs'

const DEFAULT_DONATION_AMOUNT = '$ 1.50'

export type DonationData = UseLoadShoppingGivesConfigs['shoppingGivesDonationValues'] | null

type UseCalcDonationAmountProps = {
  isSGWReady: boolean
  promotionPrice: number
  shoppingGivesDonationValues: DonationData
  formatNumber: (value: number, options: unknown) => string
}

export function useCalcDonationAmount({
  isSGWReady,
  formatNumber,
  promotionPrice,
  shoppingGivesDonationValues,
}: UseCalcDonationAmountProps): string {
  return useMemo(() => {
    const calculatedDonationAmount = calcStaticWidgetDonationAmount(
      promotionPrice,
      shoppingGivesDonationValues,
      formatNumber
    )

    return calculatedDonationAmount || DEFAULT_DONATION_AMOUNT
  }, [shoppingGivesDonationValues, isSGWReady])
}

function calcStaticWidgetDonationAmount(
  selectedProductPrice: number = 0,
  donationData: DonationData,
  formatNumber: UseCalcDonationAmountProps['formatNumber']
) {
  if (!donationData) {
    return
  }

  const multiplier = donationData.donationActionValue === 0 ? 1 : donationData.donationActionValue

  if (donationData.defaultDonationType === 0) {
    // Calc donation percentage
    return formatNumber(
      Math.floor(selectedProductPrice * (donationData.defaultDonation / 100) * multiplier * 100) /
        100,
      {
        style: 'currency',
        currency: donationData.primaryCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )
  } else {
    // Set fixed donation
    return formatNumber(Math.floor(donationData.defaultDonation * multiplier * 100) / 100, {
      style: 'currency',
      currency: donationData.primaryCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }
}
