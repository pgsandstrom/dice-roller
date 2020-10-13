export interface DiceEvent {
  id: string
  name: string
  created: string
  rolls: DiceRoll[]
}

export interface DiceRoll {
  name: string
  uniqueResults: boolean
  sides: number
}

export interface EventParticipant {
  id: string
  event_id: string
  name?: string
  created: string
  complete: boolean
  rolls:
    | EventParticipantRollIncomplete[]
    | EventParticipantRollComplete[]
    | EventParticipantRollHashed[]
}

export interface EventParticipantIncomplete extends EventParticipant {
  name: undefined
  complete: false
  rolls: EventParticipantRollIncomplete[]
}

export interface EventParticipantRollIncomplete {
  serverSeed: string
}

export interface EventParticipantHashed extends EventParticipant {
  name: undefined
  complete: false
  rolls: EventParticipantRollHashed[]
}

export interface EventParticipantRollHashed {
  serverSeedHash: string
}

export interface EventParticipantComplete extends EventParticipant {
  name: string
  complete: true
  rolls: EventParticipantRollComplete[]
}

export interface EventParticipantRollComplete {
  serverSeed: string
  seed: string
  result: number[]
}

export type Dictionary<K extends string | number | symbol, V> = { [key in K]: V }

export type PartialDict<K extends string | number | symbol, V> = { [key in K]?: V }
