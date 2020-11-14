import { v4 as uuidv4 } from 'uuid'
import { query, querySingle, SQL } from './db'
import { DiceEvent, DiceRoll } from '../types'

export const getDiceEvent = async (id: string) => {
  const diceEvent = await querySingle<DiceEvent>(
    SQL`SELECT id, name, rolls FROM dice_event WHERE id = ${id}`,
  )
  console.log(`plox: ${id}, ${JSON.stringify(diceEvent)}`)
  return diceEvent
}

export const createDiceEvent = async (name: string, rolls: DiceRoll[]) => {
  let id = getDiceEventBasicId(name)
  if ((await getDiceEvent(id)) !== undefined) {
    const short_uuid = uuidv4().split('-')[0]
    id = `${id}-${short_uuid}`
  }

  await query(
    SQL`INSERT INTO dice_event(id, name, rolls) VALUES(${id}, ${name}, ${JSON.stringify(rolls)}) `,
  )
  return id
}

const getDiceEventBasicId = (name: string) => {
  const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '-')
  return cleanName
}
