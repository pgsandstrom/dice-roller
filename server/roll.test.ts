import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { doRoll } from './roll'

describe('roll function', () => {
  // warning: this takes like a 1-2 minutes to run
  it('should produce an even spread', () => {
    const resultSpread: number[][] = []
    _.times(100000, () => {
      const s1 = uuidv4()
      const s2 = uuidv4()
      const resultList = doRoll(s1, s2, 10)
      resultList.forEach((result) => {
        expect(result).toBeLessThanOrEqual(10)
        expect(result).toBeGreaterThanOrEqual(1)
      })

      resultList.forEach((result, index) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (resultSpread[index] === undefined) {
          resultSpread[index] = []
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (resultSpread[index][result] === undefined) {
          resultSpread[index][result] = 0
        }
        resultSpread[index][result] = resultSpread[index][result] + 1
      })
    })

    // console.log(resultSpread)

    resultSpread.forEach((iteration) => {
      iteration.forEach((count, index) => {
        if (index !== 0) {
          expect(count).toBeLessThanOrEqual(10300)
          expect(count).toBeGreaterThanOrEqual(9700)
        }
      })
    })
  })
})
