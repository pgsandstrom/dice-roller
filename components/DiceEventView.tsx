import { Typography } from '@material-ui/core'
import React from 'react'
import { DiceEvent } from '../types'

interface DiceEventProps {
  diceEvent: DiceEvent
}

export default function DiceEventView({ diceEvent }: DiceEventProps) {
  return (
    <div>
      <Typography variant="h6">{diceEvent.name}</Typography>
      {JSON.stringify(diceEvent)}
      {diceEvent.rolls.map((roll, index) => {
        return <div key={index}>hej</div>
      })}
    </div>
  )
}
