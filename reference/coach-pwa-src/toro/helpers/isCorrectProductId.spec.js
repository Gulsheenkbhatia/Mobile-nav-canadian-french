import isCorrectProductId from './isCorrectProductId'

describe('isCorrectProductId', () => {
  it('should return true if the product ID is correct', () => {
    const opts = {
      query: {
        slug: ['C6098.html'],
      },
    }
    const result = isCorrectProductId(opts)
    expect(result).toBe(true)
  })

  it('should return false if the product ID is incorrect', () => {
    const opts = {
      query: {
        slug: ['return%20bouncex.submitCampaignStep(1886108);%20return%20false.html'],
      },
    }
    const result = isCorrectProductId(opts)
    expect(result).toBe(false)
  })
})
