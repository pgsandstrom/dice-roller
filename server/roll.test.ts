import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { doRoll } from './roll'

describe('renders BLAH', () => {
  it('asdf', () => {
    _.times(100, () => {
      const s1 = uuidv4()
      const s2 = uuidv4()
      const result = doRoll(s1, s2, 10)
      expect(result).toBeLessThanOrEqual(10)
      expect(result).toBeGreaterThanOrEqual(1)
    })
  })
})
