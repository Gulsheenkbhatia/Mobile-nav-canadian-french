export const setRecipeDataInStorage = (result, productId, masterId, isCustomize, prevRecipeId) => {
  let currentCustomProducts = getRecipeDataFromStorage()

  const currData = getConstructedObjectForStorage(result, productId)

  if (!isCustomize) {
    if (masterId in currentCustomProducts) {
      currentCustomProducts[masterId].push(currData)
    } else {
      currentCustomProducts[masterId] = [currData]
    }
  } else {
    if (currentCustomProducts[masterId]) {
      currentCustomProducts[masterId].forEach((data, index) => {
        if (data.id === prevRecipeId) currentCustomProducts[masterId][index] = currData
      })
    } else {
      currentCustomProducts[masterId] = [currData]
    }
  }

  localStorage.setItem('customProducts', JSON.stringify(currentCustomProducts))
}

export const getRecipeDataFromStorage = () => {
  const currentCustomProducts = localStorage.getItem('customProducts')
  if (currentCustomProducts == null || currentCustomProducts == '') {
    return {}
  }
  return JSON.parse(currentCustomProducts)
}

const getConstructedObjectForStorage = (result, productId) => {
  let currData = {}
  currData.id = result.recipe.id
  result.recipeData = null
  result.saved = true
  result.id = result.recipe.id
  result.sku = productId
  result.productId = productId
  currData.result = result

  return currData
}

export const setItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}
