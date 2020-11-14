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
  id: string
  event_id: string
  created: string
  complete: boolean
  rolls: EventParticipantRollIncomplete[] | EventParticipantRollComplete[]
}

export interface EventParticipantIncomplete extends EventParticipant {
  complete: false
  rolls: EventParticipantRollIncomplete[]
}

export interface EventParticipantRollIncomplete {
  hash: string
}

export interface EventParticipantComplete extends EventParticipant {
  complete: true
  rolls: EventParticipantRollComplete[]
}

export interface EventParticipantRollComplete {
  hash: string
  seed: string
  result: number
}

export type Dictionary<K extends string | number | symbol, V> = { [key in K]: V }

export type PartialDict<K extends string | number | symbol, V> = { [key in K]?: V }
