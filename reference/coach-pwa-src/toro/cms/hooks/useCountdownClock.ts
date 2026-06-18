import useSafeLayoutEffect from 'toro/hooks/useSafeLayoutEffect'
import padStart from 'lodash/padStart'

export const COUNTDOWN_HTML_IDENTIFIER = '[data-countdown-endTime]'
export function startCountdown(elt: HTMLElement): () => void | undefined {
  // Set the date we're counting down to
  const dayElt = elt.querySelectorAll('.ca_days_ticker') as NodeListOf<Element> | null
  const hoursElt = elt.querySelectorAll('.ca_hours_ticker') as NodeListOf<Element> | null
  const minutesElt = elt.querySelectorAll('.ca_minutes_ticker') as NodeListOf<Element> | null
  const secondsElt = elt.querySelectorAll('.ca_seconds_ticker') as NodeListOf<Element> | null

  if (dayElt?.length || hoursElt?.length || minutesElt?.length || secondsElt?.length) {
    const countDownDate = new Date(elt.dataset['countdownEndtime']).getTime()

    const timerRef = setInterval(() => {
      const now = new Date().getTime()
      const distance = Math.max(countDownDate - now, 0)

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      if (dayElt?.length === 0 || !dayElt) {
        hours = days * 24 + hours
      }
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      if (dayElt.length > 0) {
        dayElt.forEach((el: HTMLElement | null) => {
          el.innerText = padStart(`${days}`, 2, '0')
        })
      }

      hoursElt.forEach((el: HTMLElement | null) => {
        el.innerText = padStart(`${hours}`, 2, '0')
      })
      minutesElt.forEach((el: HTMLElement | null) => {
        el.innerText = padStart(`${minutes}`, 2, '0')
      })
      if (secondsElt.length > 0) {
        secondsElt.forEach((el: HTMLElement | null) => {
          el.innerText = padStart(`${seconds}`, 2, '0')
        })
      }

      if (distance <= 0) clearInterval(timerRef)
    }, 1000)

    return () => {
      clearInterval(timerRef)
    }
  }
}

export const useCountdownClock = () => {
  useSafeLayoutEffect(() => {
    const ampsCountdownBanners = Array.from(document.querySelectorAll(COUNTDOWN_HTML_IDENTIFIER))
    const cleanUpFunctions = ampsCountdownBanners.length
      ? ampsCountdownBanners.map(startCountdown)
      : undefined

    return () => {
      cleanUpFunctions?.forEach((cleanUpFn) => cleanUpFn?.())
    }
  }, [])
}
