import fetchFromSfccApi from 'toro/helpers/fetchFromSfccApi'

const fetchPreferencesFromCustomAPI = async (ids, req) => {
  const headlessHeader = req.headers['headlessheader']

  const headers = {
    'Content-Type': 'application/json',
    HeadlessHeader: headlessHeader,
  }
  const result = await fetchFromSfccApi(
    'Headless-GetPreferences',
    req,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ ids }),
    },
    false,
    true
  )

  return result
}

export default fetchPreferencesFromCustomAPI
