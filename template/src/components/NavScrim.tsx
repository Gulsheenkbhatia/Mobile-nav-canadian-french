type NavScrimProps = {
  open: boolean
  onClose: () => void
  className?: string
}

export function NavScrim({ open, onClose, className = '' }: NavScrimProps) {
  return (
    <div
      className={`retail-nav-scrim ${open ? 'retail-nav-scrim--open' : 'retail-nav-scrim--closed'} ${className}`.trim()}
      onClick={onClose}
      aria-hidden={!open}
    />
  )
}
