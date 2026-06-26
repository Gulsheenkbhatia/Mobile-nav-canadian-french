type CoachIconMaskProps = {
  src: string
  size?: number
  color?: string
  className?: string
  label?: string
}

export function CoachIconMask({
  src,
  size = 20,
  color = 'var(--fg-1)',
  className = '',
  label,
}: CoachIconMaskProps) {
  return (
    <span
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        mask: `url(${src}) no-repeat center / contain`,
      }}
    />
  )
}
