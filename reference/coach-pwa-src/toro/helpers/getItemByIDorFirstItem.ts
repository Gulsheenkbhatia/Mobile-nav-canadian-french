type Item = {
  id: string
  [key: string]: unknown
}

const getItemByIDorFirstItem = (id: string, arr: Item[]): Item =>
  arr?.find((item) => item?.id === id) || arr?.[0]

export default getItemByIDorFirstItem
