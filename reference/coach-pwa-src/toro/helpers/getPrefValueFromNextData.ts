import get from 'lodash/get'

const getPrefValueFromNextData = (nextData, prefGroup, prefId) => {
  const value = get(nextData, 'props.pageProps.appData.preferences')?.[prefGroup]?.find(
    (item) => item.id === prefId
  )?.value
  return value
}

export default getPrefValueFromNextData
