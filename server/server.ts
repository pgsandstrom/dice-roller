import { v4 as uuidv4 } from 'uuid'
import { query, querySingle, SQL } from './db'
import {
  DiceEvent,
  DiceRoll,
  EventParticipantComplete,
  EventParticipantIncomplete,
  EventParticipantRollIncomplete,
} from '../types'
import { sha256 } from '../util/hash-util'
import {
  validateEventName,
  validateEventParticipant,
  validateParticipantName,
  validateRolls,
  validateSeeds,
} from '../util/validateEvent'

export const getDiceEvent = async (id: string) => {
  const diceEvent = await querySingle<DiceEvent>(
    SQL`SELECT id, name, rolls FROM dice_event WHERE id = ${id}`,
  )
  return diceEvent
}

export const createDiceEvent = async (name: string, rolls: DiceRoll[]) => {
  let id = getDiceEventBasicId(name)
  if ((await getDiceEvent(id)) !== undefined) {
    const short_uuid = uuidv4().split('-')[0]
    id = `${id}-${short_uuid}`
  }

  if (!validateEventName(name)) {
    throw new Error('invalid name')
  }

  if (!validateRolls(rolls)) {
    throw new Error('invalid rolls')
  }

  await query(
    SQL`INSERT INTO dice_event(id, name, rolls) VALUES(${id}, ${name}, ${JSON.stringify(rolls)}) `,
  )
  return id
}

export const createParticipation = async (eventId: string) => {
  const diceEvent = await getDiceEvent(eventId)

  if (!diceEvent) {
    throw new Error(`could not find event ${eventId}`)
  }

  const participantRolls: EventParticipantRollIncomplete[] = diceEvent.rolls.map((roll) => {
    return {
      hash: uuidv4(),
    }
  })

  const id = uuidv4()
  await query(
    SQL`INSERT INTO event_participant(id, event_id, complete, rolls) VALUES(${id}, ${eventId}, false, ${JSON.stringify(
      participantRolls,
    )}) `,
  )

  return getParticipantIncomplete(id, true)
}

const getParticipantIncomplete = async (
  id: string,
  hashHashes: boolean,
): Promise<EventParticipantIncomplete> => {
  const eventParticipantIncomplete = await querySingle<EventParticipantIncomplete>(
    SQL`SELECT id, event_id, complete, rolls FROM event_participant WHERE id = ${id}`,
  )

  if (!eventParticipantIncomplete) {
    throw new Error(`could not find event participant ${id}`)
  }

  if (!validateEventParticipant(eventParticipantIncomplete)) {
    throw new Error(
      `eventParticipantIncomplete failed validation: ${JSON.stringify(eventParticipantIncomplete)}`,
    )
  }

  return {
    ...eventParticipantIncomplete,
    rolls: eventParticipantIncomplete.rolls.map((roll) => {
      return {
        hash: hashHashes ? sha256(roll.hash) : roll.hash,
      }
    }),
  }
}

export const getParticipantComplete = async (eventId: string) => {
  const queryResult = await query<EventParticipantComplete>(
    SQL`SELECT id, event_id, name, complete, rolls FROM event_participant WHERE event_id = ${eventId} AND complete IS TRUE`,
  )
  return queryResult.rows
}

export const finishParticipant = async (id: string, name: string, seeds: string[]) => {
  const participantIncomplete: EventParticipantIncomplete = await getParticipantIncomplete(
    id,
    false,
  )

  const event = await getDiceEvent(participantIncomplete.event_id)
  if (!event) {
    throw new Error(`did not find event: ${participantIncomplete.event_id}`)
  }

  if (!validateParticipantName(name)) {
    throw new Error(`invalid name: ${name}`)
  }

  if (!validateSeeds(seeds)) {
    throw new Error(`invalid seeds: ${JSON.stringify(seeds)}`)
  }

  const participantComplete: EventParticipantComplete = {
    ...participantIncomplete,
    name,
    complete: true,
    rolls: participantIncomplete.rolls.map((roll, index) => {
      const seed = seeds[index]
      const sides = event.rolls[index].sides
      return {
        ...roll,
        seed,
        result: doRoll(roll.hash, seed, sides),
      }
    }),
  }

  await query(
    SQL`UPDATE event_participant SET rolls = ${JSON.stringify(participantComplete.rolls)}, name = ${
      participantComplete.name
    },complete = TRUE WHERE id = ${participantComplete.id}`,
  )
}

const doRoll = (hash: string, seed: string, sides: number) => {
  let str = sha256(`${hash}${seed}`)

  const numberLength = `${sides}`.length

  let attempts = 1
  while (attempts < 1000) {
    const result = new RegExp(`[0-9]{${numberLength}}`).exec(str)
    if (result) {
      const rollResult = parseInt(result[0], 10)
      if (rollResult < sides) {
        // 0 is equal to max, thats why we do this magic here:
        return rollResult !== 0 ? rollResult : sides
      }
    }
    str = sha256(str)
    attempts += 1
  }
  throw new Error('Failed to do roll')
}

const getDiceEventBasicId = (name: string) => {
  const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '-')
  return cleanName
}
