import Truefit50 from 'components/assets/truefit-50.svg'
import TruefitIcon from '@tapestry-inc/design-tokens/kate-spade/icon/object/truefit.svg'

const TruefitIconComponent = ({ firstDecimalDigit }) => {
  if (
    new Array(9)
      .fill(0)
      .map((_, n) => n + 1)
      .includes(firstDecimalDigit)
  )
    return <Truefit50 />
  return <TruefitIcon />
}

export default TruefitIconComponent
