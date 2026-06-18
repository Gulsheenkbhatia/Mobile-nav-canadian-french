import { ComponentType } from 'react'
import Head from 'next/head'
import ThinkGrid from 'toro/components/list/ThinkPage/ThinkGrid'
import usePreference from 'toro/hooks/usePreference_new'
import LazySlot from 'toro/cms/components/LandingContent/LazySlot'
import ThinkGridRecommendations from 'toro/components/list/ThinkPage/ThinkGridRecommendations'
import useLandingContent from 'toro/hooks/useLandingContent'
import usePageTitle from 'toro/hooks/usePageTitle'
import Box from 'toro/components/Box'
import { CONTAINER_ID } from 'toro/constants/appConstants'
import ThinkTabbedContent from 'toro/components/list/ThinkPage/ThinkTabbedContent'
import RecommendationsContainer from 'toro/components/RecommendationsContainer'
import NotifyMePopUp from 'toro/components/product/NotifyMeWidget'

// Type for LazySlot props since it's a JS component
interface LazySlotProps {
  slot: {
    id: string
    html: string
  }
  idx: number
  lazyLoadImages?: boolean
  lazyLoadVideos?: boolean
  enableLazy?: boolean
  lazyThreshold?: number
}

const LazySlotTyped = LazySlot as ComponentType<LazySlotProps>

const ThinkPage = ({ pageData }) => {
  const {
    priceType,
    suppressMaterial,
    pageType,
    pageTitle,
    name,
    isFPC = false,
    isSPC = false,
    isComparablePriceEnabledCategory = false,
    enableAddToBag,
    categoryImageSequence,
    showOnlySinglePrice = false,
    thinkPageSwatchesDisabled,
    productTitleCharLimit = null,
    enableLazy,
    lazyThreshold,
  } = pageData
  const title = pageTitle || (name && name.toLowerCase()) || ''
  const thinkPageTitle = usePageTitle(title)

  const {
    priceSitePreferences: { isComparablePriceValue },
  } = usePreference({
    priceSitePreferences: ['isComparablePriceValue'],
  })

  useLandingContent()

  return (
    <>
      <Head>
        <title>{thinkPageTitle}</title>
      </Head>
      <Box id={CONTAINER_ID} sx={{ backgroundColor: 'var(--color-page-bg)' }}>
        {pageData.pageTemplate.map((row, idx) => {
          if (row.gridVariant) {
            return (
              <ThinkGrid
                key={row.id}
                gridVariant={row.gridVariant}
                products={row.products}
                rowStartPosition={row.rowStartPosition}
                onModelSequence={row.onModelSequence}
                priceType={priceType}
                isComparablePriceValue={isComparablePriceValue}
                suppressMaterial={suppressMaterial}
                pageType={pageType}
                isFPC={isFPC}
                isSPC={isSPC}
                isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
                enableAddToBag={enableAddToBag}
                categoryImageSequence={categoryImageSequence}
                showOnlySinglePrice={showOnlySinglePrice}
                thinkPageSwatchesDisabled={thinkPageSwatchesDisabled}
                productTitleCharLimit={productTitleCharLimit}
              />
            )
          }

          if (row.html) {
            return (
              <LazySlotTyped
                key={row.id}
                slot={row}
                idx={idx}
                lazyLoadImages
                lazyLoadVideos
                enableLazy={enableLazy}
                lazyThreshold={lazyThreshold}
              />
            )
          }

          if (row.tabs) {
            return (
              <ThinkTabbedContent
                key={row.id}
                item={row}
                productsPerPage={row.productsPerPage}
                rowStartPosition={row.rowStartPosition}
                priceType={priceType}
                isComparablePriceValue={isComparablePriceValue}
                suppressMaterial={suppressMaterial}
                pageType={pageType}
                isFPC={isFPC}
                isSPC={isSPC}
                isComparablePriceEnabledCategory={isComparablePriceEnabledCategory}
                enableAddToBag={enableAddToBag}
                categoryImageSequence={categoryImageSequence}
                showOnlySinglePrice={showOnlySinglePrice}
                thinkPageSwatchesDisabled={thinkPageSwatchesDisabled}
                productTitleCharLimit={productTitleCharLimit}
                enableLazy={enableLazy}
                lazyThreshold={lazyThreshold}
              />
            )
          }

          if (row.type === 'recomGrid') {
            return (
              <ThinkGridRecommendations
                key={row.id}
                id={row.id}
                content={row.content}
                viewMoreText={row.viewMoreText}
                viewLessText={row.viewLessText}
                type={row.schema}
                title={row.title}
                subtitle={row.subtitle}
              />
            )
          }

          if (row.type === 'recomCarousel') {
            return (
              <Box maxWidth="1400px" mx="auto" key={row.id}>
                <RecommendationsContainer type={row.schema} variant="recomCarouselThink" />
              </Box>
            )
          }

          return null
        })}
      </Box>
      <NotifyMePopUp />
    </>
  )
}

export default ThinkPage
