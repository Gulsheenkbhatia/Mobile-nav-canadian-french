import getItemByIDorFirstItem from './getItemByIDorFirstItem'

test('returns element by id', () => {
  expect(
    getItemByIDorFirstItem('a', [
      { id: 'a', something: 'else' },
      { id: 'b', something: 'different' },
    ])
  ).toEqual({ id: 'a', something: 'else' })
  expect(
    getItemByIDorFirstItem('b', [
      { id: 'a', something: 'else' },
      { id: 'b', something: 'different' },
    ])
  ).toEqual({ id: 'b', something: 'different' })
})

test('returns first element', () => {
  expect(
    getItemByIDorFirstItem('z', [
      { id: 'a', something: 'else' },
      { id: 'b', something: 'different' },
    ])
  ).toEqual({ id: 'a', something: 'else' })
})

test('returns undefined', () => {
  expect(getItemByIDorFirstItem('z', [])).toEqual(undefined)
})
