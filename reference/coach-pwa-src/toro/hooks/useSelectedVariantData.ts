import { selectedVariantAtom } from 'store/pdp.atom'
import createUseSelectData from 'toro/helpers/createUseSelectData'

const useSelectedVariantData = createUseSelectData(selectedVariantAtom)

export default useSelectedVariantData
