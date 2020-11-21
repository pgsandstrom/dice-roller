import _ from 'lodash'
import { sha256 } from '../util/hash-util'

export const doRoll = (serverSeed: string, userSeed: string, diceSides: number): number[] => {
  const str = sha256(`${serverSeed}${userSeed}`)

  const number = BigInt(`0x${str}`)

  const result: number[] = []
  _.times(10, (i) => {
    const newVal = number / BigInt(Math.pow(10, i)) // bigint is integer, no need to floor this value
    const iterationResult = Number((newVal % BigInt(diceSides)) + BigInt(1))
    result.push(iterationResult)
  })
  return result
}
