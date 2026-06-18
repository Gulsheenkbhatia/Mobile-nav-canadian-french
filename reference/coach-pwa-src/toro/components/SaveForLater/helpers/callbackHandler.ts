type CallbackHandlerProps = {
  wishlistId: string
  callback: (wishlistId: string) => void
  callbackName: string
}

export function callbackHandler({ wishlistId, callback, callbackName }: CallbackHandlerProps) {
  if (!callback || !wishlistId) return

  try {
    callback(wishlistId)
  } catch (e) {
    console.error(`Error in SaveForLater callbackHandler ${callbackName}:`, e)
  }
}
