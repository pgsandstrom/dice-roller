export interface DiceEvent {
  id: string
  name: string
  created: string
  rolls: DiceRoll[]
}

export interface DiceRoll {
  name: string
  sides: number
}

export interface EventParticipant {
  hash: string
  event_id: string
  created: string
  rolls: number[]
}

export type Dictionary<K extends string | number | symbol, V> = { [key in K]: V }

export type PartialDict<K extends string | number | symbol, V> = { [key in K]?: V }
