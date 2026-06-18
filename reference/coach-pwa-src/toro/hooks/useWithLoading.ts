import { useState, useCallback } from 'react'

type AsyncFunction<T extends unknown[], R> = (...args: T) => Promise<R>

type UseWithLoadingReturn<T extends unknown[], R> = [
  (...args: T) => Promise<R>,
  boolean | undefined,
  React.Dispatch<React.SetStateAction<boolean | undefined>>
]

const useWithLoading = <T extends unknown[], R>(
  func: AsyncFunction<T, R>,
  deps: React.DependencyList = [],
  onChange?: (loading: boolean) => void
): UseWithLoadingReturn<T, R> => {
  const [loading, setLoading] = useState<boolean | undefined>()

  return [
    useCallback(
      async (...args: T): Promise<R> => {
        setLoading(true)
        onChange?.(true)
        const result = await func(...args)
        setLoading(false)
        onChange?.(false)
        return result
      },
      [func, ...deps]
    ),
    loading,
    setLoading,
  ]
}

export default useWithLoading
