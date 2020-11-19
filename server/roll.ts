import { sha256 } from '../util/hash-util'

export const doRoll = (serverSeed: string, userSeed: string, diceSides: number) => {
  const str = sha256(`${serverSeed}${userSeed}`)

  const number = parseInt(str, 16)

  return (number % diceSides) + 1
}
