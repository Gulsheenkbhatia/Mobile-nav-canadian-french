import TangibleeWidget from 'toro/components/product/Tangiblee/TangibleeWidget'
import withFeatureFlag from 'toro/hocs/withFeatureFlag'

const OnHeroImage = withFeatureFlag((props) => <TangibleeWidget onHeroImage {...props} />, {
  Tangiblee: ['TANGIBLEE_CTA_ON_HERO_IMAGE'],
})

const OnDetails = withFeatureFlag(
  TangibleeWidget,
  {
    Tangiblee: ['TANGIBLEE_CTA_ON_HERO_IMAGE'],
  },
  false
)

export default { OnHeroImage, OnDetails }
