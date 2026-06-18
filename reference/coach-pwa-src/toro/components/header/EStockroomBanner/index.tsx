import { useMultiStyleConfig } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import { ProfileIcon } from 'toro/components/header/EStockroomBanner/icons'
import SessionContext from 'toro/components/SessionContext'
import get from 'lodash/get'
import { useIntl } from 'react-intl'
import PWAContext from 'components/common/PWAContext'
import getCurrentLocale from 'toro/helpers/getCurrentLocale'

const EStockroomBanner = () => {
  const { session } = useContext(SessionContext)
  const isEstockroomUser = !!get(session, 'user.isEstockroomUser')
  const estockFirstName: string = get(session, 'user.estockFirstName')?.trim() || ''
  const estockLastName: string = get(session, 'user.estockLastName')?.trim() || ''
  const { formatMessage } = useIntl()
  const { appData } = useContext(PWAContext)
  const { siteId } = appData
  const { locale } = getCurrentLocale(get(appData, 'locale', ''))
  const currentLocale = locale?.replace(/-/g, '_') || 'en_US'
  const eStockRoomLogoutLink = `/on/demandware.store/Sites-${siteId}-Site/${currentLocale}/Employee-EStockRoomLogout`
  const styles = useMultiStyleConfig('EStockroomBanner', {})
  const router = useRouter()

  const onClickLogout = () => {
    router.push(eStockRoomLogoutLink)
  }

  if (!isEstockroomUser) return null

  return (
    <Box sx={styles.bannerEstockroomWrapper}>
      <Box sx={styles.bannerEstockroomContainer}>
        <Box data-qa="estckrom_txt_success_login" sx={styles.bannerEstockroomContent}>
          <ProfileIcon style={styles.bannerEstockroomIcon} />
          {formatMessage({
            id: 'eStockroomBanner.header.text',
            defaultMessage: `${estockFirstName} ${estockLastName} logged into eStockRoom`,
          })}
        </Box>
        <Button
          onClick={onClickLogout}
          data-qa="estckrom_btn_logout"
          size="lg"
          sx={styles.bannerEstockroomLogoutButton}
        >
          {formatMessage({
            id: 'eStockroomBanner.header.logoutText',
            defaultMessage: 'Logout Of Estockroom',
          })}
        </Button>
      </Box>
    </Box>
  )
}

export default EStockroomBanner
