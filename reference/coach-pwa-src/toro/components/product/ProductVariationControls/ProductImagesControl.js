import dynamic from 'next/dynamic'
import { memo, useContext } from 'react'
import ProductImagesControlContext from 'toro/components/product/ProductVariationControls/ProductImagesControlContext'
import getAPIURL from 'helpers/getAPIURL'
import Link from 'toro/components/Link'
import get from 'lodash/get'
import ProductColor from 'toro/components/product/ProductVariationControls/ProductColorItem'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import Hidden from 'toro/components/Hidden'
import { useUpdateAtom } from 'jotai/utils'
import { setFullscreenLoadingAtom } from 'store/fullscreen-loading.atom'

const ShowMoreLessControl = dynamic(
  () => import('toro/components/product/ProductVariationControls/ShowMoreLessControl'),
  { ssr: false }
)

function ProductImagesControl() {
  const {
    items,
    selectedItem,
    isMegaPDPEligible,
    isQuickView,
    isShowMore,
    setShowMore,
    maxSwatch,
  } = useContext(ProductImagesControlContext)

  const setFullscreenLoading = useUpdateAtom(setFullscreenLoadingAtom)

  return (
    <>
      {items?.map((item, idx) => {
        const selected =
          get(item, 'id') === get(selectedItem, 'id') &&
          get(item, 'masterId') === get(selectedItem, 'masterId')

        const isSameParent = get(item, 'masterId') === get(selectedItem, 'masterId')

        const ProductColorItem = (
          <ProductColor selected={selected} isSameParent={isSameParent} item={item} idx={idx} />
        )
        return !isMegaPDPEligible ? (
          ProductColorItem
        ) : !isQuickView ? (
          isSameParent ? (
            ProductColorItem
          ) : (
            <Link
              key={item?.vgId}
              href={item?.url}
              variant="unstyled"
              prefetch={true}
              prefetchUrl={getAPIURL(item?.url)}
              scroll={false}
              onClick={() => setFullscreenLoading(true)}
            >
              {ProductColorItem}
            </Link>
          )
        ) : (
          isSameParent && ProductColorItem
        )
      })}

      <Hidden onMobile isFragment>
        <ShowMoreLessControl
          items={items}
          maxSwatch={maxSwatch}
          isShowMore={isShowMore}
          setShowMore={setShowMore}
          isQuickView={isQuickView}
        />
      </Hidden>
    </>
  )
}

export default memo(withErrorBoundaryWrapper(ProductImagesControl))
