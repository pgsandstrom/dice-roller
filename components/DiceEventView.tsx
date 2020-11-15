import { Button, Dialog, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { DiceEvent, EventParticipantComplete } from '../types'
import ParticipateView from './ParticipateView'

interface DiceEventProps {
  diceEvent: DiceEvent
  participantComplete: EventParticipantComplete[]
}

export default function DiceEventView({ diceEvent, participantComplete }: DiceEventProps) {
  const [showParticipationDialog, setShowParticipationDialog] = useState(false)

  const closeAndRefresh = () => {
    setShowParticipationDialog(false)
    // TODO nicer reload
    location.reload()
  }

  return (
    <div>
      <Typography variant="h6">{diceEvent.name}</Typography>
      <div>
        <div style={{ display: 'flex' }}>
          <div style={{ flex: '1 0 0' }}>
            <Typography variant="subtitle1" style={{ display: 'inline' }}>
              Name
            </Typography>
          </div>
          {diceEvent.rolls.map((roll, index) => {
            return (
              <div key={index} style={{ flex: '1 0 0' }}>
                <Typography variant="subtitle1" style={{ display: 'inline' }}>
                  {roll.name}
                </Typography>
                <Typography variant="subtitle2" style={{ display: 'inline', paddingLeft: '5px' }}>
                  ({roll.sides} sides)
                </Typography>
              </div>
            )
          })}
        </div>
        {participantComplete.map((participant) => {
          return (
            <div key={participant.id} style={{ display: 'flex' }}>
              <div style={{ flex: '1 0 0' }}>{participant.name}</div>
              {participant.rolls.map((roll) => {
                return (
                  <div key={roll.hash} style={{ flex: '1 0 0' }}>
                    {roll.result}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
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
      <style jsx>{``}</style>
    </div>
  )
}
