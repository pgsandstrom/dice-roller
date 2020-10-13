import { v4 as uuidv4 } from 'uuid'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import { Button, Collapse, TextField, Typography } from '@material-ui/core'
import React, { useCallback, useEffect, useState } from 'react'
import { DiceEvent, DiceRoll, EventParticipantHashed, EventParticipantRollHashed } from '../types'
import getServerUrl from '../util/serverUrl'
import { validateParticipantName } from '../util/validateEvent'

interface ParticipateViewProps {
  diceEvent: DiceEvent
  close: () => void
}

export default function ParticipateView({ diceEvent, close }: ParticipateViewProps) {
  const [eventParticipantIncomplete, setEventParticipantIncomplete] =
    useState<EventParticipantHashed>()
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
        const e = (await response.json()) as EventParticipantHashed
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
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={showValidationError && !validateParticipantName(name)}
        style={{ width: '100%' }}
      />
      <div>
        <Button
          variant="outlined"
          onClick={() => finishParticipation()}
          style={{ marginTop: '20px' }}
        >
          Roll
        </Button>
      </div>
      <div>
        <Button
          variant="contained"
          onClick={() => setShowNerdStuff(!showNerdStuff)}
          style={{ marginTop: '20px' }}
          endIcon={showNerdStuff ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
        >
          {showNerdStuff ? 'Hide' : 'Show'} nerd stuff
        </Button>
      </div>
      <Collapse in={showNerdStuff}>
        <div style={{ marginTop: '20px' }}>
          Here you can alter the seed that will be used in combination with the servers seed to
          generate your dice rolls. You can see a fingerprint, which is the sha256 hash of the
          servers seed. The servers seed can be seen on the event after you have made your roll. The
          exact code for generating your dice roll can be seen{' '}
          <a
            href="https://github.com/pgsandstrom/dice-roller/blob/main/server/roll.ts"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </div>
        <div>
          {diceEvent.rolls.map((roll, index) => {
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
      </Collapse>
    </div>
  )
}

interface RollRowProps {
  incompleteRoll: EventParticipantRollHashed
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
        <Typography variant="caption">fingerprint: {incompleteRoll.serverSeedHash}</Typography>
      </div>
    </div>
  )
}
