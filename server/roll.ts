import { sha256 } from '../util/hash-util'

export const doRoll = (serverSeed: string, userSeed: string, diceSides: number) => {
  let str = sha256(`${serverSeed}${userSeed}`)

  const numberLength = `${diceSides}`.length

  let attempts = 1
  while (attempts < 1000) {
    const result = new RegExp(`[0-9]{${numberLength}}`).exec(str)
    if (result) {
      const rollResult = parseInt(result[0], 10)
      if (rollResult < diceSides) {
        // 0 is equal to max, thats why we do this magic here:
        return rollResult !== 0 ? rollResult : diceSides
      }
    }
    str = sha256(str)
    attempts += 1
  }
  throw new Error('Failed to do roll')
}
