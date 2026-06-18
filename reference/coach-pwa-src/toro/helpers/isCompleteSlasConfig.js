function isCompleteSlasConfig() {
  const {
    SLAS_REDIRECT_URI,
    SLAS_PRIVATE_CLIENT_SECRET,
    SLAS_PRIVATE_CLIENT_ID,
    SLAS_PUBLIC_CLIENT_ID,
  } = process.env

  return [
    SLAS_REDIRECT_URI,
    SLAS_PRIVATE_CLIENT_SECRET,
    SLAS_PRIVATE_CLIENT_ID,
    SLAS_PUBLIC_CLIENT_ID,
  ].every((item) => item)
}

export default isCompleteSlasConfig
