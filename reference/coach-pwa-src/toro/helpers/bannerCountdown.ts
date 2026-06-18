import { useEffect, useState } from 'react'
import padStart from 'lodash/padStart'

const timerInterval = 1000

function startCountdown(elt: ParentNode | null): (() => void) | void {
  if (!elt) return
  const countdownBanner = elt.querySelector('.js-countdown-banner') as HTMLElement | null
  if (!countdownBanner) {
    return
  }
  const dealType = countdownBanner.dataset['dealType'] || 'doh'
  const hoursElt = countdownBanner.querySelector(
    '.js-cd-time-section .js-hour'
  ) as HTMLElement | null
  const minutesElt = countdownBanner.querySelector(
    '.js-cd-time-section .js-min'
  ) as HTMLElement | null
  const secondsElt = countdownBanner.querySelector(
    '.js-cd-time-section .js-sec'
  ) as HTMLElement | null

  const endTimeText = countdownBanner.dataset['endTime']
  const endTime = endTimeText ? new Date(endTimeText) : new Date()
  const headerEl = elt.querySelector('.js-navbar-header-user .wishlist-icon') as HTMLElement | null
  const currTimeText = headerEl?.dataset['currentTime']
  const currentTime = currTimeText ? new Date(currTimeText) : new Date()

  let timeRemaining = endTime.getTime() - currentTime.getTime()

  function renderTime() {
    const hours = Math.max(Math.floor((timeRemaining / (1000 * 60 * 60)) % 24), 0)
    const minutes = Math.max(Math.floor((timeRemaining / 1000 / 60) % 60), 0)
    const seconds = Math.max(Math.floor((timeRemaining / 1000) % 60), 0)

    if (dealType === 'dod' && hoursElt) {
      hoursElt.innerText = padStart(`${hours}`, 2, '0')
    }

    if (minutesElt && secondsElt) {
      minutesElt.innerText = padStart(`${minutes}`, 2, '0')
      secondsElt.innerText = padStart(`${seconds}`, 2, '0')
    }
  }

  if (timeRemaining <= 0) {
    renderTime()
  } else {
    const timer = setInterval(() => {
      renderTime()
      if (timeRemaining <= 0) {
        clearInterval(timer)
      } else {
        timeRemaining -= timerInterval
      }
    }, timerInterval)
    return () => {
      clearInterval(timer)
    }
  }
}

export const useCountdownBanner = (): ((node: ParentNode) => void) => {
  const [node, setNode] = useState<ParentNode>(null)
  useEffect(() => {
    const cleanup = startCountdown(node)
    return () => cleanup && cleanup()
  }, [node])
  return setNode
}
