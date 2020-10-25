import { querySingle, SQL } from './db'
import { DiceEvent } from '../types'

export const getDiceEvent = async (hash: string) => {
  const diceEvent = await querySingle<DiceEvent>(
    SQL`SELECT hash, raw FROM dice_event WHERE hash = ${hash}`,
  )
  return diceEvent
}
