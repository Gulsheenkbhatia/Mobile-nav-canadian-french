import get from 'lodash/get'
import withCorrId from 'helpers/traceability'

const fetchContentAssetForOnPurpose = async (
  onPurposeMaterialsContentAssetId: string
): Promise<any> => {
  try {
    const fetchWithCorrId = withCorrId()
    const response = await fetchWithCorrId(
      `/api/get-content-assets?ids=${encodeURIComponent(`${onPurposeMaterialsContentAssetId}`)}`
    )
    const { data } = await response.json()
    const { 'on-purpose-materials-content': onPurposeMaterialsContent } = data || {}
    const onPurposeContentAssetData = get(onPurposeMaterialsContent, 'c_body.default.markup', '')
    return onPurposeContentAssetData
  } catch (e) {
    throw new Error(
      `Error fetching content assets for onPurposeMaterials ${onPurposeMaterialsContentAssetId} : ${e.message}`
    )
  }
}

export default fetchContentAssetForOnPurpose
