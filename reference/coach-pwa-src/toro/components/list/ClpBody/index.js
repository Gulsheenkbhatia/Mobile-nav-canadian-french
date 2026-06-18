import LandingContent from 'toro/cms/components/LandingContent'

export default function ClpBody({
  slots,
  onClickCmsAnalytics,
  hasVideoContent = false,
  isComparablePriceEnabledCategory = false,
}) {
  return (
    <LandingContent
      slots={slots}
      onClickCmsAnalytics={onClickCmsAnalytics}
      hasVideoContent={hasVideoContent}
      isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
    />
  )
}
