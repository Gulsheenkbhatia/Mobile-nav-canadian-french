const getMediaSequence = (sequence = '') => {
  if (!sequence) return null
  return sequence.split(/[,|]/g).reduce((prev, curr, index) => {
    prev[curr] = index
    return prev
  }, {})
}

export default getMediaSequence
