/** ISO timestamp injected at build time — see vite.config.ts. */
export const PROTOTYPE_BUILD_TIME = __APP_BUILD_TIME__

export function formatPrototypeBuildTimestamp(iso: string): string {
  const date = new Date(iso)
  const dateLabel = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
  const timeLabel = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)

  return `${dateLabel} at ${timeLabel}`
}
