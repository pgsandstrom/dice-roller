import { v4 as uuidv4 } from 'uuid'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { Button, TextField, Typography } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import {
  DiceEvent,
  DiceRoll,
  EventParticipantIncomplete,
  EventParticipantRollIncomplete,
} from '../types'
import getServerUrl from '../util/serverUrl'
import { validateParticipantName } from '../util/validateEvent'

interface ParticipateViewProps {
  diceEvent: DiceEvent
  close: () => void
}

export default function ParticipateView({ diceEvent, close }: ParticipateViewProps) {
  const [eventParticipantIncomplete, setEventParticipantIncomplete] = useState<
    EventParticipantIncomplete
  >()
  const [error, setError] = useState(false)
  const [seeds, setSeeds] = useState<string[]>(() => {
    return diceEvent.rolls.map(() => uuidv4())
  })
  const [name, setName] = useState('')
  const [showValidationError, setShowValidationError] = useState(false)

  const [showNerdStuff, setShowNerdStuff] = useState(false)

  const createParticipation = useCallback(async () => {
    try {
      const response = await fetch(`${getServerUrl()}/api/participant/create`, {
        method: 'PUT',
        body: JSON.stringify({
          eventId: diceEvent.id,
        }),
        credentials: 'same-origin',
      })

      if (response.status < 400) {
        const e = (await response.json()) as EventParticipantIncomplete
        setEventParticipantIncomplete(e)
      } else {
        setError(true)
      }
    } catch (e) {
      setError(true)
    }
  }, [diceEvent.id])

  useEffect(() => {
    void createParticipation()
  }, [createParticipation])

  const finishParticipation = async () => {
    if (!validateParticipantName(name)) {
      setShowValidationError(true)
      return
    }
    try {
      const response = await fetch(`${getServerUrl()}/api/participant/finish`, {
        method: 'PUT',
        body: JSON.stringify({
          id: eventParticipantIncomplete!.id,
          name: name.trim(),
          seeds,
        }),
        credentials: 'same-origin',
      })

      if (response.status < 400) {
        close()
      } else {
        setError(true)
      }
    } catch (e) {
      setError(true)
    }
  }

  if (error) {
    return <div>An error has occurred. Sorry :(</div>
  }

  if (!eventParticipantIncomplete) {
    return <div>loading</div>
  }

  return (
    <div>
      <div></div>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={showValidationError && !validateParticipantName(name)}
        style={{ width: '100%' }}
      />
      <Button
        variant="outlined"
        onClick={() => finishParticipation()}
        style={{ marginTop: '20px' }}
      >
        Roll
      </Button>
      {!showNerdStuff && (
        <>
          <div style={{ marginTop: '20px' }}>
            Enter your name and click &apos;roll&apos;. Or you can dig into the nerd stuff.
          </div>
          <Button
            variant="contained"
            onClick={() => setShowNerdStuff(true)}
            style={{ marginTop: '20px' }}
            endIcon={<ArrowDropDownIcon />}
          >
            Show nerd stuff
          </Button>
        </>
      )}
      {showNerdStuff && <div>Explanation</div>}
      {showNerdStuff &&
        diceEvent.rolls.map((roll, index) => {
          return (
            <RollRow
              key={index}
              roll={roll}
              incompleteRoll={eventParticipantIncomplete.rolls[index]}
              seed={seeds[index]}
              setSeed={(newSeed: string) => {
                setSeeds(
                  seeds.map((seed, i) => {
                    if (index === i) {
                      return newSeed
                    } else {
                      return seed
                    }
                  }),
                )
              }}
            />
          )
        })}
    </div>
  )
}

interface RollRowProps {
  incompleteRoll: EventParticipantRollIncomplete
  roll: DiceRoll
  seed: string
  setSeed: (s: string) => void
}

const RollRow = ({ incompleteRoll, roll, seed, setSeed }: RollRowProps) => {
  return (
    <div>
      <Typography variant="h6">{roll.name}</Typography>
      <TextField value={seed} style={{ width: '100%' }} onChange={(e) => setSeed(e.target.value)} />
      <div>
        <Typography variant="caption">fingerprint: {incompleteRoll.hash}</Typography>
      </div>
    </div>
  )
}
