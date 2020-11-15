import { DiceRoll, EventParticipant, EventParticipantRollIncomplete } from '../types'

export const validateEventName = (title?: string): title is string => {
  return title !== undefined && title.length > 0 && title.length < 200
}

export const validateRolls = (rolls: DiceRoll[] | undefined) => {
  return rolls !== undefined && rolls.length > 0 && rolls.every(validateRoll)
}

export const validateRoll = (roll: Partial<DiceRoll>) => {
  return (
    roll.name !== undefined &&
    roll.name.length > 0 &&
    roll.name.length < 500 &&
    roll.sides !== undefined &&
    roll.sides > 0 &&
    roll.sides < 101
  )
}

export const validateEventParticipant = (eventParticipant: Partial<EventParticipant>) => {
  // TODO improve?
  return (
    eventParticipant.id !== undefined &&
    Array.isArray(eventParticipant.rolls) &&
    eventParticipant.rolls.every((roll: Partial<EventParticipantRollIncomplete>) => {
      return roll.hash !== undefined
    })
  )
}
