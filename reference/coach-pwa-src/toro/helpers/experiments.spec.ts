import { getExperiments } from 'toro/helpers/experiments'

const EXPERIMENT_IDS = {
  ONE_A: 'abtest1_a',
  TWO_B: 'abtest2_b',
  THREE_A: 'abtest3_a',
  FOUR_B: 'abtest4_b',
}

describe('toro/helpers/experiments.ts -> getExperiments()', () => {
  describe('given a string of Optimizely experiment IDs and a string of env controlled experiment IDs, both separated by the colon symbol "-"', () => {
    it('should return an alphabetically sorted list of experiment IDs separated by the colon symbol "-" when the IDs are unique and non-empty', () => {
      expect(
        getExperiments(
          `${EXPERIMENT_IDS.TWO_B}-${EXPERIMENT_IDS.ONE_A}`,
          `${EXPERIMENT_IDS.FOUR_B}-${EXPERIMENT_IDS.THREE_A}`
        )
      ).toEqual(
        `${EXPERIMENT_IDS.ONE_A}-${EXPERIMENT_IDS.TWO_B}-${EXPERIMENT_IDS.THREE_A}-${EXPERIMENT_IDS.FOUR_B}`
      )
    })
    it('should return an alphabetically sorted  list of unique experiment IDs separated by the colon symbol "-" when some of the IDs are duplicates and all are non-empty', () => {
      expect(
        getExperiments(
          `${EXPERIMENT_IDS.TWO_B}-${EXPERIMENT_IDS.ONE_A}`,
          `${EXPERIMENT_IDS.ONE_A}-${EXPERIMENT_IDS.THREE_A}`
        )
      ).toEqual(`${EXPERIMENT_IDS.ONE_A}-${EXPERIMENT_IDS.TWO_B}-${EXPERIMENT_IDS.THREE_A}`)
    })
    it('should return an alphabetically sorted  list of valid experiment IDs separated by the colon symbol "-" when some of the IDs are empty', () => {
      expect(
        getExperiments(
          `${EXPERIMENT_IDS.TWO_B}--${EXPERIMENT_IDS.ONE_A}`,
          `${EXPERIMENT_IDS.FOUR_B}-${EXPERIMENT_IDS.THREE_A}-`
        )
      ).toEqual(
        `${EXPERIMENT_IDS.ONE_A}-${EXPERIMENT_IDS.TWO_B}-${EXPERIMENT_IDS.THREE_A}-${EXPERIMENT_IDS.FOUR_B}`
      )
    })
    it('should return an empty string when the IDs are not strings', () => {
      expect(getExperiments('', [] as any)).toEqual('')
    })
  })
})
