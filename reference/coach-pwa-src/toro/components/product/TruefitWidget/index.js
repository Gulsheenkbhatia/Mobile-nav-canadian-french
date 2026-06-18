import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IconButton, useDisclosure } from '@chakra-ui/react'
import HStack from 'toro/components/Hstack'
import Cookies from 'js-cookie'
import { TRUEFIT_TOKEN } from 'toro/constants/cookies'
import useAnalytics from 'toro/analytics/useAnalytics'
import Flex from 'toro/components/Flex'
import Modal from 'toro/components/Modal'
import ModalOverlay from 'toro/components/ModalOverlay'
import ModalContent from 'toro/components/ModalContent'
import Button from 'toro/components/Button'
import Head from 'next/head'
import useMultiStyleConfig from 'toro/hooks/useMultiStyleConfig'
import fetch from 'toro/helpers/fetch'
import withErrorBoundaryWrapper from 'toro/hocs/withErrorBoundaryWrapper'
import ChevronDown from 'components/assets/chevron-down-sm.svg'
import Avatar from '@tapestry-inc/design-tokens/kate-spade/icon/object/avatar.svg'
import TruefitIcon from '@tapestry-inc/design-tokens/kate-spade/icon/object/truefit.svg'
import useViewportType from 'toro/hooks/useViewportType'
import PropTypes from 'prop-types'

const setTokenInCookie = (token) => {
  Cookies.set(TRUEFIT_TOKEN, token, { secure: true, sameSite: 'None' })
}

const getTokenFromCookies = () => Cookies.get(TRUEFIT_TOKEN)

const TruefitWidget = ({ masterId, truefitClientID, trueFitApiUrl, variantId, isSticky }) => {
  const [trueFitRecommendation, setTrueFitRecommendation] = useState({})
  const { isOpen: isModalOpen, onClose, onOpen } = useDisclosure()
  const [iframSrcUrl, setIframeSrcUrl] = useState('')
  const triggerWidgetImpressionRef = useRef(false)
  const triggerRecommendationImpressionRef = useRef(false)
  const recommendationRef = useRef(trueFitRecommendation)
  const locationRef = useRef('')
  const { viewport } = useViewportType()
  const styles = useMultiStyleConfig('TruefitWidget')
  const analytics = useAnalytics()

  const cta = trueFitRecommendation[masterId]?.cta
  const profileSwitcherCta = trueFitRecommendation[masterId]?.profileSwitcherCta

  const fireTruefitInteractionEvent = ({ isClicked, recommendation }) => {
    const status = recommendation?.[masterId]?.status
    const interactionData = {
      eventLabel: variantId,
    }
    if (status === 'nouser' && (triggerWidgetImpressionRef?.current || isClicked)) {
      interactionData['eventAction'] = isClicked
        ? 'truefit widget click'
        : 'truefit widget impression'
      triggerWidgetImpressionRef.current = false
    } else if (status === 'success' && (triggerRecommendationImpressionRef?.current || isClicked)) {
      interactionData['eventAction'] = isClicked
        ? 'truefit recommendation click'
        : 'truefit recommendation impression'
      triggerRecommendationImpressionRef.current = false
    } else {
      return
    }
    analytics?.send('truefitInteraction', interactionData)
  }

  const fetchTokenFromTrueFit = async () => {
    try {
      const trueFitToken = await fetch(
        `https://${trueFitApiUrl}/profile/public/v3/${truefitClientID}/token`
      ).then((res) => res.json())
      return trueFitToken
    } catch (err) {
      return err
    }
  }

  const fetchTrueFitRecommendations = async () => {
    try {
      const apiUrl = `https://${trueFitApiUrl}/consumer/public/v3/${truefitClientID}/fit/tfc-fitrec-product?s=${masterId}&platform=web&deviceType=${viewport}&applicationName=RetailerChat`
      const options = {
        headers: {
          'X-TF-UserToken': getTokenFromCookies(),
        },
        credentials: 'include',
      }
      const truefitResponse = await fetch(apiUrl, options)
      const updatedToken = truefitResponse?.headers?.get('X-TF-UserToken')
      const { recommendations: truefitRecommendations } = await truefitResponse.json()
      triggerRecommendationImpressionRef.current =
        truefitRecommendations?.[masterId]?.size !== recommendationRef?.current?.[masterId]?.size
      setTokenInCookie(updatedToken || getTokenFromCookies())
      setTrueFitRecommendation(truefitRecommendations)
      fireTruefitInteractionEvent({ isClicked: false, recommendation: truefitRecommendations })
    } catch (err) {
      console.log('Error in fetching recommendations from truefit', err)
    }
  }

  const handleButtonClick = useCallback(
    (url, isProfileIconClicked = false) => {
      const srcurl = `${url}&originUrl=${locationRef.current}`
      if (!isProfileIconClicked) {
        fireTruefitInteractionEvent({ isClicked: true, recommendation: trueFitRecommendation })
      }
      setIframeSrcUrl(srcurl)
      onOpen()
    },
    [trueFitRecommendation]
  )

  const handleMessageCloseEvent = useCallback(() => {
    onClose()
    fetchTrueFitRecommendations()
  }, [])

  const handleMessageUserTokenEvent = useCallback((data) => {
    setTokenInCookie(data?.value)
  }, [])

  const onIconClick = useCallback(() => {
    handleButtonClick(cta?.url)
  }, [cta?.url])

  const onAvatarClick = useCallback(() => {
    handleButtonClick(profileSwitcherCta?.url, true)
  }, [profileSwitcherCta?.url])

  const handleMessageEvent = (messageEvent) => {
    try {
      if (messageEvent?.origin?.indexOf('truefitcorp.com') !== -1) {
        const msg = JSON.parse(messageEvent?.data)
        switch (msg?.message) {
          case 'close':
            handleMessageCloseEvent()
            break
          case 'usertoken':
            handleMessageUserTokenEvent(msg?.data)
            break
          default:
        }
      }
    } catch (e) {
      console.log('error in handleMessageEvent', e)
    }
  }

  useEffect(() => {
    window.addEventListener('message', handleMessageEvent)
    locationRef.current = encodeURIComponent(window.location.origin)
    const isTokenExists = getTokenFromCookies()
    triggerWidgetImpressionRef.current = true
    if (!isSticky) {
      if (isTokenExists) {
        fetchTrueFitRecommendations()
      } else {
        fetchTokenFromTrueFit()
          .then(({ token }) => {
            setTokenInCookie(token)
            fetchTrueFitRecommendations()
          })
          .catch((err) => {
            console.log('Error in fetching token from truefit', err)
          })
      }
    }
    return () => {
      window.removeEventListener('message', handleMessageEvent)
    }
  }, [isSticky])

  const showButtonAsAlink = !cta?.message?.includes('?')
  const buttonStyles = useMemo(() => {
    return styles.TrueFitButton(showButtonAsAlink)
  }, [showButtonAsAlink])

  const recommendable = trueFitRecommendation?.[masterId]?.recommendable
  recommendationRef.current = trueFitRecommendation

  return (
    <>
      <Head>
        <link rel="preconnect" href={cta?.url} crossOrigin="anonymous" />
      </Head>
      <Modal lockFocusAcrossFrames isOpen={isModalOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent sx={styles.trueFitModalWrapper}>
          <iframe frameBorder="0" style={{ minHeight: '100%' }} src={iframSrcUrl}></iframe>
        </ModalContent>
      </Modal>

      <HStack sx={styles.TrueFitContainer} className="truefit-widget">
        {recommendable && (
          <Button
            leftIcon={<TruefitIcon />}
            size="lg"
            colorScheme="black"
            variant={showButtonAsAlink ? 'link' : 'outline'}
            onClick={onIconClick}
            sx={buttonStyles}
          >
            {cta?.message}
          </Button>
        )}
        {recommendable && profileSwitcherCta?.message && (
          <Flex onClick={onAvatarClick}>
            <IconButton
              aria-label="Avatar Icon"
              colorScheme="black"
              variant="link"
              size="xs"
              icon={<Avatar />}
              sx={styles.IconFocus}
            />
            <IconButton
              aria-label="Chevron Icon"
              colorScheme="black"
              variant="link"
              size="xs"
              icon={<ChevronDown />}
              sx={styles.IconFocus}
            />
          </Flex>
        )}
      </HStack>
    </>
  )
}

TruefitWidget.propTypes = {
  masterId: PropTypes.string,
  truefitClientID: PropTypes.string,
  trueFitApiUrl: PropTypes.string,
  variantId: PropTypes.string,
  isSticky: PropTypes.bool,
}
TruefitWidget.defaultProps = {
  masterId: '',
  truefitClientID: '',
  trueFitApiUrl: '',
  variantId: '',
  isSticky: false,
}

export default withErrorBoundaryWrapper(TruefitWidget)
