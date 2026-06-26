import type { ButtonHTMLAttributes, ReactNode } from 'react'

type CoachButtonVariant = 'primary' | 'secondary' | 'tertiary'
type CoachButtonSize = 'base' | 'small'

type CoachButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: CoachButtonVariant
  size?: CoachButtonSize
  children: ReactNode
}

export function CoachButton({
  variant = 'primary',
  size = 'base',
  children,
  className = '',
  disabled,
  ...rest
}: CoachButtonProps) {
  const sizeClasses =
    size === 'small' ? 'h-9 px-[22px] text-xs' : 'h-11 px-[30px] text-sm'

  const variantClasses: Record<CoachButtonVariant, string> = {
    primary:
      'bg-coach-black text-coach-white hover:bg-[var(--color-bg-cta-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coach-black disabled:bg-[var(--color-inactive)] disabled:text-[var(--color-grey-50)]',
    secondary:
      'bg-coach-white text-coach-black border border-coach-black hover:bg-coach-page focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coach-black disabled:border-[var(--color-inactive)] disabled:text-[var(--color-grey-50)]',
    tertiary:
      'h-auto px-1 py-0.5 rounded-none bg-transparent underline underline-offset-2 hover:text-coach-grey-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coach-black',
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full font-extended tracking-[0.3px] transition-colors duration-[var(--duration-coach-fast)] ease-coach-quick disabled:cursor-not-allowed ${sizeClasses} ${variantClasses[disabled ? 'primary' : variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
