import { DiceRoll } from '../types'

export const validateEventName = (title?: string): title is string => {
  return title !== undefined && title.length > 0
}

export const validateRoll = (roll: Partial<DiceRoll>) => {
  return (
    roll.name !== undefined && roll.name.length > 0 && roll.sides !== undefined && roll.sides > 0
  )
}
