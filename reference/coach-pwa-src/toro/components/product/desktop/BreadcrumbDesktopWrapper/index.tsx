import { FC, memo } from 'react'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import useProductData from 'toro/hooks/useProductData'
import BreadCrumb from 'toro/components/BreadcrumbPage'

const BreadcrumbDesktopWrapper: FC = () => {
  const breadCrumbs = useProductData('breadcrumbs')

  return <BreadCrumb breadcrumbData={breadCrumbs} variant="pdpv5" />
}

export default withErrorBoundaryWrapper(memo(BreadcrumbDesktopWrapper))
