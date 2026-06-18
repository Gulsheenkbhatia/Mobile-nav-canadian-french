import { useState, useMemo } from 'react'
import Box from 'toro/components/Box'
import Button from 'toro/components/Button'
import useDisclosure from 'toro/hooks/useDisclosure'
import { Collapse } from '@chakra-ui/react'
import useStyleConfig from 'toro/hooks/useStyleConfig'
import { useUpdateAtom } from 'jotai/utils'
import { surveyStatusAtom, updateSurveyLastInteractionAtom } from 'store/survey-session-atom'
import { useIntl } from 'react-intl'
import { SelectedIcon, CloseIcon } from 'toro/icons'
import shuffle from 'lodash/shuffle'
import useAnalytics from 'toro/analytics/useAnalytics'
import { useInView } from 'react-intersection-observer'

export type SurveyProps = {
  answers: string[]
  variant?: string
}

export enum SurveyStatus {
  OPEN = 'open',
  ANSWERED = 'answered',
  CLOSED = 'closed',
}

const SURVEY_INTERACTION_EVENT = 'surveyInteraction'
const SURVEY_RESPONSE_ACTION = 'survey response submission'

function Survey({ answers, variant }: SurveyProps) {
  const styles = useStyleConfig('Survey', { variant })
  const { formatMessage } = useIntl()
  const updateSurveyLastInteraction = useUpdateAtom(updateSurveyLastInteractionAtom)
  const updateSurveyStatus = useUpdateAtom(surveyStatusAtom)
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const [selectedAnswer, setSelectedAnswer] = useState({ idx: -1, answer: '' })
  const [surveyStatus, setSurveyStatus] = useState<SurveyStatus>(SurveyStatus.OPEN)

  const analytics = useAnalytics()

  const sortedAnswers = useMemo(() => {
    return shuffle(answers)
  }, [answers])

  const title = formatMessage({
    id: 'plp.survey.title',
    defaultMessage: 'What brought you here today?',
  })

  const subTitle = formatMessage({
    id: 'plp.survey.subTitle',
    defaultMessage: `We'd love to hear from you! Share your reason for visiting our site.`,
  })

  const submitText = formatMessage({
    id: 'plp.survey.submitText',
    defaultMessage: 'Submit',
  })

  const declineText = formatMessage({
    id: 'plp.survey.declineText',
    defaultMessage: 'Prefer not to answer.',
  })

  const confirmationMessage = formatMessage({
    id: 'plp.survey.confirmationMessage',
    defaultMessage: 'Thank you!',
  })

  const feedbackMessage = formatMessage({
    id: 'plp.survey.feedbackMessage',
    defaultMessage:
      'Your response matters to us and will help us offer better shopping experiences.',
  })

  const [inViewRef] = useInView({
    triggerOnce: true,
    onChange: (inView) => {
      if (inView) {
        analytics.send(SURVEY_INTERACTION_EVENT, {
          eventAction: 'survey impression',
          eventLabel: title,
        })
      }
    },
  })

  const handleSelectAnswer = (idx: number, answer: string) => {
    setSelectedAnswer({ idx, answer })
  }

  const handleAnswerSurvey = () => {
    onClose()
    setSurveyStatus(SurveyStatus.ANSWERED)
    analytics.send(SURVEY_INTERACTION_EVENT, {
      eventAction: SURVEY_RESPONSE_ACTION,
      eventLabel: `${title}:${selectedAnswer.answer.substring(0, 500)}`,
    })
  }

  const handleCloseSurvey = () => {
    onClose()
    setSurveyStatus(SurveyStatus.CLOSED)
    updateSurveyStatus(SurveyStatus.CLOSED)
    analytics.send(SURVEY_INTERACTION_EVENT, {
      eventAction: SURVEY_RESPONSE_ACTION,
      eventLabel: `${title}:${declineText}`,
    })
  }

  const handleCompleteSurvey = () => {
    handleFinishSurvey(true)
  }

  const handleFinishSurvey = (complete: boolean) => {
    if (complete) {
      updateSurveyStatus(SurveyStatus.CLOSED)
      return
    }

    if (surveyStatus === SurveyStatus.ANSWERED) {
      updateSurveyStatus(SurveyStatus.ANSWERED)
    }

    updateSurveyLastInteraction()
  }

  return (
    <Box
      sx={styles.surveyWrapper}
      minHeight={surveyStatus === 'closed' ? '0px' : '150px'}
      ref={inViewRef}
    >
      {surveyStatus === 'answered' && (
        <Box sx={styles.confirmationWrapper}>
          <Box sx={styles.confirmationContainer}>
            <Box data-qa="thankyou_note" as="h2" sx={styles.surveyTitle}>
              {confirmationMessage}
            </Box>
            <Box as="h3" sx={styles.surveySubTitle}>
              {feedbackMessage}
            </Box>
            <Box data-qa="close_thankyou" sx={styles.closeButton} onClick={handleCompleteSurvey}>
              <CloseIcon width="16" height="16" />
            </Box>
          </Box>
        </Box>
      )}
      <Collapse
        in={isOpen}
        onAnimationComplete={() => handleFinishSurvey(false)}
        transition={{ exit: { duration: 0.5 } }}
      >
        <Box sx={styles.surveyContainer}>
          <Box data-qa="survey_section" sx={styles.surveyInnerContainer}>
            <Box as="h2" sx={styles.surveyTitle}>
              {title}
            </Box>
            <Box as="h3" sx={styles.surveySubTitle}>
              {subTitle}
            </Box>
            <Box data-qa="response_section" sx={styles.answersContainer}>
              {sortedAnswers.map((answer, idx) => (
                <Box
                  sx={styles.answerContainer}
                  key={idx}
                  className={`${selectedAnswer.idx === idx ? 'selected' : ''}`}
                  onClick={() => handleSelectAnswer(idx, answer)}
                >
                  {selectedAnswer.idx === idx ? (
                    <SelectedIcon width="16" height="16" />
                  ) : (
                    <Box sx={styles.radio} />
                  )}
                  {answer}
                </Box>
              ))}
            </Box>
            <Box sx={styles.separator} />
            <Button
              data-qa="submit_btn"
              sx={styles.submitButton}
              onClick={handleAnswerSurvey}
              disabled={selectedAnswer.idx < 0}
            >
              {submitText}
            </Button>
            <Button data-qa="hide_survey" sx={styles.declineButton} onClick={handleCloseSurvey}>
              {declineText}
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  )
}

export default Survey
