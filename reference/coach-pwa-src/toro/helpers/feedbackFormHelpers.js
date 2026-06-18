import toggleBodyScroll from 'toro/helpers/toggleBodyScroll'

export function handleFeedbackButtonClick() {
  const mainModal = document.querySelector('#modalFeedback')
  const closeButton = mainModal.querySelector('#close-button-feedback')
  const feedbackIframe = mainModal.querySelector('#feedbackIframe')
  const src = feedbackIframe.dataset['src']
  feedbackIframe.src = src
  toggleBodyScroll(false)

  const handleClick = function () {
    mainModal.style.display = 'none'
    toggleBodyScroll(true)
  }

  closeButton.addEventListener('click', handleClick)

  mainModal.style.display = 'block'

  return () => {
    closeButton.removeEventListener('click', handleClick)
  }
}
