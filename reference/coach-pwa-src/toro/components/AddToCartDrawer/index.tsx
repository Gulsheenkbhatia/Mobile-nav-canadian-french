import { FC, useContext } from 'react'
import Experiment from 'toro/components/Experiment'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Hidden from 'toro/components/Hidden'
import dynamic from 'next/dynamic'
import get from 'lodash/get'
import PWAContext from 'components/common/PWAContext'

const AddToBagDrawer = dynamic(() => import('toro/components/AddToBagDrawer'), {
  ssr: false,
})
const AddToCartPreviewDrawer = dynamic(() => import('toro/components/AddToCartPreviewDrawer'), {
  ssr: false,
})

const AddToCartDrawer: FC = () => {
  const { appData } = useContext(PWAContext)
  const isATBDrawerEnabled = get(appData, 'isAddToCartDrawerEnabled', false)

  if (!isATBDrawerEnabled) return null

  return (
    <>
      <Experiment forIDs={EXPERIMENTS.POST_ATB_DESKTOP} forDesktop>
        <AddToCartPreviewDrawer />
      </Experiment>
      <Hidden onDesktop>
        <AddToBagDrawer />
      </Hidden>
    </>
  )
}

export default AddToCartDrawer
