import { fetchFromServerSideWithCorrId } from 'helpers/fetchFromServerSide'

const url = '/api/getAppData'

export default async function fetchAppData(req) {
  return fetchFromServerSideWithCorrId(req, url).then((appDataRes) => appDataRes.json())
}
