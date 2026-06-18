import React from 'react'
import range from 'lodash/range'
import HStack from 'toro/components/Hstack'
import TruefitIconComponent from './TruefitIconComponent'

const TruefitScore = ({ score }) => {
  const truefitScore = score > 1 ? score / 2 : score
  let firstDecimalDigit = 0
  const [, firstDigit] = /\d\.?(\d)?/.exec(truefitScore)
  if (firstDigit) {
    firstDecimalDigit = Number(firstDigit)
  }

  return (
    <HStack>
      {range(5).map((idx) =>
        parseInt(truefitScore) > idx ? (
          <TruefitIconComponent width="16" height="16" key={idx} />
        ) : (
          firstDecimalDigit > 0 &&
          parseInt(truefitScore) === idx && (
            <TruefitIconComponent
              firstDecimalDigit={firstDecimalDigit}
              width="16"
              height="16"
              key={idx}
            />
          )
        )
      )}
    </HStack>
  )
}

export default TruefitScore
