import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useUpdateAtom } from 'jotai/utils'
import { useInView } from 'react-intersection-observer'
import Box from 'toro/components/Box'
import Text from 'toro/components/Text'
import Flex from 'toro/components/Flex'
import PWAContext from 'components/common/PWAContext'
import usePreference from 'toro/hooks/usePreference_new'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import { setIsPdpV7CharmsSectionInViewAtom } from 'store/pdpv7.atom'

const CharmsSelector = () => {
  const styles = useStyleConfig('CharmsSelector')
  const { formatMessage } = useIntl()
  const { injectScriptOnce } = useContext(PWAContext)
  const setIsPdpV7CharmsSectionInView = useUpdateAtom(setIsPdpV7CharmsSectionInViewAtom)

  const { ref: charmsSectionRef } = useInView({
    threshold: 0,
    triggerOnce: false,
    rootMargin: '0px 0px -50px 0px',
    onChange: (inView) => {
      setIsPdpV7CharmsSectionInView(inView)
    },
  })

  useEffect(() => {
    return () => setIsPdpV7CharmsSectionInView(false)
  }, [setIsPdpV7CharmsSectionInView])
  const {
    tangiblee: {
      TANGIBLEE_INTEGRATION_SCRIPT_PDPV7: scriptSrc,
      IS_TANGIBLEE_ENABLED: isTangibleeEnabled,
      TANGIBLEE_CHARMS_CTR_ID: tangibleeCharmsCtrId = 'tangiblee-charms-pdp-container',
    },
  } = usePreference({
    Tangiblee: [
      'TANGIBLEE_INTEGRATION_SCRIPT_PDPV7',
      'IS_TANGIBLEE_ENABLED',
      'TANGIBLEE_CHARMS_CTR_ID',
    ],
  })
  useEffect(() => {
    if (!scriptSrc || !isTangibleeEnabled || !injectScriptOnce) return
    injectScriptOnce(scriptSrc)
  }, [scriptSrc, isTangibleeEnabled, injectScriptOnce])

  return (
    <Flex ref={charmsSectionRef} className="make-it-yours" sx={styles.charmsContainer}>
      <Box className="make-it-yours-box" data-qa="make-it-yours">
        <Text className="make-it-yours-title" sx={styles.charmsTitle}>
          {formatMessage({
            id: 'pdpv7.makeItYours.titletext',
            defaultMessage: 'Make it Yours',
          })}
        </Text>
        <Text className="make-it-yours-subtitle" sx={styles.charmsSubtitle}>
          {formatMessage({
            id: 'pdpv7.makeItYours.subtitle',
            defaultMessage: 'Personalize your bag with straps and charms',
          })}
        </Text>
        <Box p={4} data-qa="tangiblee-wfi-pdp-container-charms" id={tangibleeCharmsCtrId}></Box>
      </Box>
    </Flex>
  )
}

export default CharmsSelector
