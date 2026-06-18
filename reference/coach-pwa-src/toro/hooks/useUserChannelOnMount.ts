import { useEffect, useState } from 'react'

export const useUserChannelOnMount = () => {
  const [userChannel, setUserChannel] = useState('')

  useEffect(() => {
    const queryParams = new URLSearchParams(window?.location.search)
    const utmMediumCode = queryParams?.get('utm_medium')
    setUserChannel(utmMediumCode)
  }, [])

  return userChannel
}
