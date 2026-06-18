import { useAtomValue, useUpdateAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { filtersAtom, searchResultsReloadingAtom } from 'store/search-results.atom'
import { reminderInCartAtom } from 'store/add-to-cart-reminder.atom'
import { useRouter } from 'next/router'

export default function ReminderInCart() {
  const router = useRouter()
  const setVisitedPagesCount = useUpdateAtom(reminderInCartAtom)

  const filters = useAtomValue(filtersAtom)
  const reloading = useAtomValue(searchResultsReloadingAtom)

  useEffect(() => {
    setVisitedPagesCount()
  }, [router.asPath])

  useEffect(() => {
    if (reloading) {
      setVisitedPagesCount()
    }
  }, [filters])

  return null
}
