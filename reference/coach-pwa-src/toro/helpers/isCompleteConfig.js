export function isCompleteKlarnaConfig() {
  const { KLARNA_PLACEMENT_KEY, KLARNA_CLIENT_ID, KLARNA_API_URL } = process.env

  return [KLARNA_PLACEMENT_KEY, KLARNA_CLIENT_ID, KLARNA_API_URL].every((item) => item)
}
