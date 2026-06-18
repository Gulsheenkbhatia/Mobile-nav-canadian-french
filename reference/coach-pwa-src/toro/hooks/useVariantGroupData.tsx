import { selectedVariantGroupAtom } from 'store/pdp.atom'
import createUseSelectData from 'toro/helpers/createUseSelectData'

const useVariantGroupData = createUseSelectData(selectedVariantGroupAtom)

export default useVariantGroupData
