import { selectedColorAtom } from 'store/pdp.atom'
import createUseSelectData from 'toro/helpers/createUseSelectData'

const useSelectedColorData = createUseSelectData(selectedColorAtom)

export default useSelectedColorData
