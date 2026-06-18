const intersectionObserverPolyfill = async () => {
  if (typeof window !== 'object') {
    return
  }

  await import('intersection-observer')
}

export default intersectionObserverPolyfill
