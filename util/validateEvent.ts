import {
  DiceRoll,
  EventParticipantComplete,
  EventParticipantIncomplete,
  EventParticipantRollIncomplete,
} from '../types'

export const validateEventName = (title?: string): boolean => {
  return title !== undefined && title.length > 0 && title.length < 200
}

export const validateRolls = (rolls: DiceRoll[] | undefined): boolean => {
  return rolls !== undefined && rolls.length > 0 && rolls.every(validateRoll)
}

export const validateParticipantName = (name?: string): boolean => {
  return name !== undefined && name.length > 0 && name.length < 200
}

export const validateSeeds = (seeds: Array<string | undefined>): boolean => {
  return seeds.length > 0 && seeds.every((seed) => seed !== undefined)
}

export const validateRoll = (roll: Partial<DiceRoll>): boolean => {
  return (
    roll.name !== undefined &&
    roll.name.length > 0 &&
    roll.name.length < 500 &&
    roll.sides !== undefined &&
    roll.sides > 1 &&
    roll.sides < 101
  )
}

export const validateEventParticipant = (
  eventParticipant: Partial<EventParticipantComplete | EventParticipantIncomplete>,
): boolean => {
  // TODO improve?
  return (
    eventParticipant.id !== undefined &&
    Array.isArray(eventParticipant.rolls) &&
    eventParticipant.rolls.every((roll: Partial<EventParticipantRollIncomplete>) => {
      return roll.serverSeed !== undefined
    })
  )
}
