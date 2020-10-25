import { DiceEvent } from '../types'

interface DiceEventProps {
  diceEvent: DiceEvent
}

export default function DiceEventView({ diceEvent }: DiceEventProps) {
  return <div>{diceEvent.id}</div>
}
