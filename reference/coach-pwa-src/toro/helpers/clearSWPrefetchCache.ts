export default async function clearSWPrefetchCache() {
  if (typeof window !== 'undefined' && 'caches' in window) {
    await caches.delete('prefetch')
  }
}
