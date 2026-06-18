import type { FC } from 'react'
import {
  NavChevronLeftIcon,
  NavChevronRightIcon,
  NavChevronLeftBoldIcon,
  NavChevronRightBoldIcon,
} from 'toro/icons'

type NavArrowProps = {
  direction: 'left' | 'right'
  bold: boolean
}

const NavArrow: FC<NavArrowProps> = ({ direction, bold }) => {
  if (direction === 'left') {
    return bold ? (
      <NavChevronLeftBoldIcon width="31" height="31" viewBox="0 0 31 31" />
    ) : (
      <NavChevronLeftIcon width="24" height="24" viewBox="0 0 24 24" />
    )
  }
  return bold ? (
    <NavChevronRightBoldIcon width="31" height="31" viewBox="0 0 31 31" />
  ) : (
    <NavChevronRightIcon width="24" height="24" viewBox="0 0 24 24" />
  )
}

export default NavArrow
