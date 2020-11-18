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
    <div className="container">
      <Typography variant="h6">{diceEvent.name}</Typography>
      <div className="grid-container">
        <div className="grid">
          <div className="grid-item top-row">
            <Typography variant="subtitle1">Name</Typography>
          </div>
          {diceEvent.rolls.map((roll, index) => {
            return (
              <div key={index} className="grid-item top-row">
                <Typography variant="subtitle1">{roll.name}</Typography>
                <Typography variant="subtitle2">({roll.sides} sides)</Typography>
              </div>
            )
          })}
          {participantComplete.map((participant) => {
            return (
              <>
                <div className="grid-item">{participant.name}</div>
                {participant.rolls.map((roll) => {
                  return (
                    <div key={roll.hash} className="grid-item">
                      {roll.result}
                    </div>
                  )
                })}
              </>
            )
          })}
        </div>
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
      <style jsx>{`
        .container {
        }
        .grid-container {
          overflow-x: auto;
          max-width: calc(100vw - 40px);
          background: black;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(${diceEvent.rolls.length + 1}, auto [col-start]);
          gap: 2px;
        }
        .grid-item {
          background: white;
          padding: 10px;
          min-width: 200px;
          max-width: 500px;
        }
      `}</style>
    </div>
  )
}
