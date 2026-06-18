import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import PropTypes from 'prop-types'
import { EXPERIMENTS } from 'toro/constants/experiments'
import Experiment from 'toro/components/Experiment'
import dynamic from 'next/dynamic'

const FindInStoreComponentV3 = dynamic(
  () => import('toro/components/product/FindInStore/FindInStoreWidget/FindInStoreComponentV3')
)

const FindInStoreComponentV3Redesign = dynamic(
  () =>
    import('toro/components/product/FindInStore/FindInStoreWidget/FindInStoreComponentV3Redesign')
)

const FindInStoreWidgetV3 = ({
  handleOnPickUpInStoreClick,
  location,
  handleOpenModal,
  isNeedFindStore,
  zipCode,
}) => {
  return (
    <>
      <Experiment forIDs={EXPERIMENTS.PDP_V3_3}>
        <FindInStoreComponentV3Redesign
          handleOnPickUpInStoreClick={handleOnPickUpInStoreClick}
          location={location}
          handleOpenModal={handleOpenModal}
          isNeedFindStore={isNeedFindStore}
          zipCode={zipCode}
        />
      </Experiment>
      <Experiment notForIDs={EXPERIMENTS.PDP_V3_3}>
        <FindInStoreComponentV3
          handleOnPickUpInStoreClick={handleOnPickUpInStoreClick}
          location={location}
          handleOpenModal={handleOpenModal}
          isNeedFindStore={isNeedFindStore}
          zipCode={zipCode}
        />
      </Experiment>
    </>
  )
}

FindInStoreWidgetV3.propTypes = {
  handleOnPickUpInStoreClick: PropTypes.func,
  location: PropTypes.string,
  handleOpenModal: PropTypes.func,
  isNeedFindStore: PropTypes.bool,
}

FindInStoreWidgetV3.defaultProps = {
  handleOnPickUpInStoreClick: () => {},
  handleOpenModal: () => {},
}

export default withErrorBoundaryWrapper(FindInStoreWidgetV3)
