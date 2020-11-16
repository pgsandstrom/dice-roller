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
        <div className="row">
          <div className="row-item">
            <Typography variant="subtitle1">Name</Typography>
          </div>
          {diceEvent.rolls.map((roll, index) => {
            return (
              <div key={index} className="row-item">
                <Typography variant="subtitle1">{roll.name}</Typography>
                <Typography variant="subtitle2">({roll.sides} sides)</Typography>
              </div>
            )
          })}
        </div>
        {participantComplete.map((participant) => {
          return (
            <div key={participant.id} className="row">
              <div className="row-item">{participant.name}</div>
              {participant.rolls.map((roll) => {
                return (
                  <div key={roll.hash} className="row-item">
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
        <div style={{ width: '100%', maxWidth: '1200px', padding: '50px' }}>
          <ParticipateView diceEvent={diceEvent} close={closeAndRefresh} />
        </div>
      </Dialog>
      <style jsx>{`
        .row {
          display: flex;
        }
        .row-item {
          flex: 1 0 160px;
          border-left: 1px solid black;
          padding: 10px;
        }
      `}</style>
    </div>
  )
}
