import { useUpdateAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { lastVisitTimeAtom } from 'store/global.atom'

const useTrackLastSeen = () => {
  const setLastVisitTime = useUpdateAtom(lastVisitTimeAtom)

  useEffect(() => {
    const updateLastVisitTime = () => {
      if (document.visibilityState === 'hidden') {
        const currentTimeInSeconds = Math.floor(Date.now() / 1000)
        setLastVisitTime(currentTimeInSeconds)
      }
    }
    document.addEventListener('visibilitychange', updateLastVisitTime)
    return () => {
      document.removeEventListener('visibilitychange', updateLastVisitTime)
    }
  }, [])
}

export default useTrackLastSeen
