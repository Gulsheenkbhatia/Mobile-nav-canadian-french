export const createAsyncStorage = <T>(defaultValue: T) => ({
  getItem(key: string): T {
    const storedValue = localStorage.getItem(key)
    try {
      return JSON.parse(storedValue ?? String(defaultValue))
    } catch {
      return defaultValue
    }
  },
  setItem(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem(key: string) {
    localStorage.removeItem(key)
  },
  subscribe(key: string, callback: (value: T) => void): () => void {
    const listener = (e: StorageEvent) => {
      if (e.storageArea === localStorage && e.key === key) {
        try {
          callback(JSON.parse(e.newValue ?? String(defaultValue)))
        } catch {
          callback(defaultValue)
        }
      }
    }
    window.addEventListener('storage', listener)
    return () => window.removeEventListener('storage', listener)
  },
})
