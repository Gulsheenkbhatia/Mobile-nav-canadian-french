const removeUrlQueryParameters = (url: string) => {
  return url.replace(/\?\$.+$/, '')
}

export default removeUrlQueryParameters
