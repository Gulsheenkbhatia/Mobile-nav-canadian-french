import { productDataAtom } from 'store/pdp.atom'
import createUseSelectData from 'toro/helpers/createUseSelectData'

/**
 * Hook that returns the value of a productDataAtom property at the specified path.
 * It uses Lodash "get" internally to read the property.
 *
 * See https://jotai.org/docs/utilities/select#hold-stable-references for more info about
 * stabilizing a "selectAtom" atom.
 *
 * @param {string|string[]} path The path of the property to be read or an array of paths of the
 * properties to be read.
 * @returns {any} Returns the value of the property at the specified path if a string path was used
 * as argument or an array of paths if an array of string paths was used instead.
 *
 * @example Get the master ID of the product { masterId: C1560, id: C1560-IMCAH }
 * useProductData('masterId')
 * // => 'C1560'
 *
 * @example Get the master ID and the product ID of the product { masterId: 'C1560', id: 'C1560 IMCAH' }
 * useProductData(['masterId', 'id'])
 * // => ['C1560', 'C1560 IMCAH']
 */
const useProductData = createUseSelectData(productDataAtom)

export default useProductData
