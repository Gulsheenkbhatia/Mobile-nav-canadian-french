import React from 'react'
import HtmlContent from 'toro/components/HtmlContent'

const CustomerFeedbackModal = ({ feedbackFormHTML }) => {
  return <HtmlContent className="content-asset_feedbackForm" content={feedbackFormHTML} />
}

export default CustomerFeedbackModal
