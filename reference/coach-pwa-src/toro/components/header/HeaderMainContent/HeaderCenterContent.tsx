import { FC, memo } from 'react'
import Flex from 'toro/components/Flex'
import { SystemStyleObject } from '@chakra-ui/react'
import Logo from 'toro/components/header/Logo/Logo'
import usePathnameMatch from 'toro/hooks/usePathnameMatch'

interface HeaderCenterContentProps {
  styles: Record<string, SystemStyleObject | any>
  isSWOutlet: boolean
  isReducedHeader: boolean
}

const HeaderCenterContent: FC<HeaderCenterContentProps> = ({
  styles,
  isSWOutlet,
  isReducedHeader,
}) => {
  const isOutletGatePage = usePathnameMatch(/sw-outlet-sale-login/)

  return (
    <Flex
      flex="1"
      justifyContent="center"
      sx={styles?.logoWrapper?.({ isOutletGatePage, isSWOutlet, isReducedHeader })}
    >
      <Logo sx={styles.logoContainer} />
    </Flex>
  )
}

export default memo(HeaderCenterContent)
