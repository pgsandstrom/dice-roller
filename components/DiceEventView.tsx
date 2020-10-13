import { Button, Dialog, Menu, Typography } from '@material-ui/core'
import HelpIcon from '@material-ui/icons/Help'
import React, { Fragment, useState } from 'react'
import { DiceEvent, EventParticipantComplete, EventParticipantRollComplete } from '../types'
import ParticipateView from './ParticipateView'

interface DiceEventProps {
  diceEvent: DiceEvent
  participantComplete: EventParticipantComplete[]
}

export default function DiceEventView({ diceEvent, participantComplete }: DiceEventProps) {
  const [showParticipationDialog, setShowParticipationDialog] = useState(false)

  const [menuAnchorEl, setMenuAnchorEl] = useState<SVGSVGElement>()
  const [showMenuIndex, setShowMenuIndex] = useState<number | undefined>()

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
          <div className="grid-item">
            <Typography variant="subtitle1">Name</Typography>
          </div>
          {diceEvent.rolls.map((roll, index) => {
            return (
              <div key={index} className="grid-item">
                <Typography variant="subtitle1">{roll.name}</Typography>
                <Typography variant="subtitle2">
                  ({roll.sides} sides{roll.uniqueResults ? ', unique result' : ''})
                </Typography>
              </div>
            )
          })}
          {participantComplete.map((participant, participantIndex) => {
            return (
              <Fragment key={participantIndex}>
                <div className="grid-item" style={{ display: 'flex' }}>
                  <span style={{ flex: '1 0 auto' }}>{participant.name}</span>
                  <HelpIcon
                    onClick={(event) => {
                      setMenuAnchorEl(event.currentTarget)
                      setShowMenuIndex(participantIndex)
                    }}
                    style={{ fontSize: '1em', cursor: 'pointer' }}
                  />
                  <Menu
                    anchorEl={menuAnchorEl}
                    keepMounted={true}
                    open={participantIndex === showMenuIndex}
                    onClose={() => {
                      setMenuAnchorEl(undefined)
                      setShowMenuIndex(undefined)
                    }}
                    style={{ marginLeft: '20px' }}
                  >
                    <div style={{ padding: '20px', width: '700px' }}>
                      <div className="seed-view-row" style={{ marginBottom: '5px' }}>
                        <span>
                          Here is the nerd stuff needed to validate that the dice rolls was fair.
                        </span>
                      </div>
                      <div className="seed-view-row" style={{ marginBottom: '5px' }}>
                        <span>Server seed</span>
                        <span>User seed</span>
                      </div>
                      {participant.rolls.map((roll) => {
                        return (
                          <div key={roll.serverSeed} className="seed-view-row">
                            <span>{roll.serverSeed}</span>
                            <span>{roll.seed}</span>
                          </div>
                        )
                      })}
                    </div>
                  </Menu>
                </div>
                {participant.rolls.map((roll, rollIndex) => {
                  let firstIrrelevantIndex
                  if (diceEvent.rolls[rollIndex].uniqueResults) {
                    firstIrrelevantIndex = getFirstIrrelevantIndexLength(
                      participant,
                      roll,
                      rollIndex,
                      participantComplete,
                    )
                  } else {
                    firstIrrelevantIndex = 1
                  }
                  const relevantResults = roll.result.slice(0, firstIrrelevantIndex)
                  return (
                    <div key={roll.serverSeed} className="grid-item">
                      {relevantResults.map((r, i) => {
                        return (
                          <span key={i} style={{ marginRight: '10px' }}>
                            {r} {i !== relevantResults.length - 1 ? ',' : ''}
                          </span>
                        )
                      })}
                    </div>
                  )
                })}
              </Fragment>
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
        .seed-view-row {
          display: flex;
        }
        .seed-view-row > * {
          flex: 1 0 0;
        }
      `}</style>
    </div>
  )
}

const getFirstIrrelevantIndexLength = (
  currentParticipant: EventParticipantComplete,
  currentRoll: EventParticipantRollComplete,
  rollIndex: number,
  allParticipants: EventParticipantComplete[],
) => {
  let relevantParticipants = allParticipants.filter((p) => p !== currentParticipant)
  let firstIrrelevantIndex = currentRoll.result.findIndex((item, resultIndex) => {
    relevantParticipants = relevantParticipants.filter((p) => {
      return p.rolls[rollIndex].result[resultIndex] === item
    })
    return relevantParticipants.length === 0
  })
  if (allParticipants.length === 1) {
    firstIrrelevantIndex = 0
  } else if (firstIrrelevantIndex === -1) {
    firstIrrelevantIndex = 10000
  }

  // honestly a bit unsure of why '+1' is needed here
  return firstIrrelevantIndex + 1
}
