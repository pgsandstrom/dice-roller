import { Button, Dialog, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { DiceEvent } from '../types'
import ParticipateView from './ParticipateView'

interface DiceEventProps {
  diceEvent: DiceEvent
}

export default function DiceEventView({ diceEvent }: DiceEventProps) {
  const [showParticipationDialog, setShowParticipationDialog] = useState(false)

  const closeAndRefresh = () => {
    setShowParticipationDialog(false)
    // TODO nicer reload
    location.reload()
  }

  return (
    <div>
      <Typography variant="h6">{diceEvent.name}</Typography>
      {diceEvent.rolls.map((roll, index) => {
        return (
          <div key={index}>
            <Typography variant="subtitle1" style={{ display: 'inline' }}>
              {roll.name}
            </Typography>
            <Typography variant="subtitle2" style={{ display: 'inline' }}>
              {roll.sides}
            </Typography>
          </div>
        )
      })}
      <Button
        variant="outlined"
        onClick={() => setShowParticipationDialog(true)}
        style={{ marginTop: '20px' }}
      >
        Participate
      </Button>
      <Dialog
        open={showParticipationDialog}
        onBackdropClick={() => setShowParticipationDialog(false)}
      >
        <div style={{ width: '600px', padding: '50px' }}>
          <ParticipateView diceEvent={diceEvent} close={closeAndRefresh} />
        </div>
      </Dialog>
    </div>
  )
}
