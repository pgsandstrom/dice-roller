import React, { useState } from 'react'
import { Button, Checkbox, FormControlLabel, TextField, Tooltip } from '@material-ui/core'
import { DiceRoll } from '../types'
import { validateEventName, validateRoll, validateRolls } from '../util/validateEvent'
import getServerUrl from '../util/serverUrl'
import GoBackWrapper from '../components/goBackWrapper'
import { useRouter } from 'next/router'

export default function CreateEvent() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [rolls, setRolls] = useState<DiceRoll[]>([{ name: '', uniqueResults: true, sides: 10 }])

  const [showValidationError, setShowValidationError] = useState(false)

  const [isPosting, setIsPosting] = useState(false)

  const [error, setError] = useState(false)

  const onCreate = async () => {
    if (!validateEventName(name) || !validateRolls(rolls)) {
      setShowValidationError(true)
      return
    }
    setIsPosting(true)
    try {
      const response = await fetch(`${getServerUrl()}/api/event/create`, {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim(),
          rolls: rolls.map((roll) => ({ ...roll, name: roll.name.trim() })),
        }),
        credentials: 'same-origin',
      })

      if (response.status < 400) {
        const body = await response.text()
        void router.push('/[id]', `/${body}`)
      } else {
        setError(true)
      }
    } catch (e) {
      setError(true)
    }
    setIsPosting(false)
  }

  if (error) {
    return (
      <GoBackWrapper>
        <div>An error has occurred. Sorry :(</div>
      </GoBackWrapper>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        <TextField
          label="Event name"
          multiline
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={showValidationError && !validateEventName(name)}
          helperText={showValidationError && !validateEventName(name) ? 'Invalid ' : ''}
          style={{ marginTop: '10px' }}
        />
        <div
          style={{
            margin: '20px 0px',
          }}
        >
          {rolls.map((roll, index) => {
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <TextField
                  label="Dice roll name"
                  multiline
                  value={roll.name}
                  onChange={(e) => {
                    setRolls(
                      rolls.map((p, i) =>
                        index === i
                          ? { name: e.target.value, uniqueResults: p.uniqueResults, sides: p.sides }
                          : p,
                      ),
                    )
                  }}
                  error={showValidationError && !validateRoll(roll)}
                  helperText={showValidationError && !validateRoll(roll) ? 'Invalid roll' : ''}
                  style={{ flex: '1 0 0', paddingRight: '10px' }}
                />
                <Tooltip
                  placement="bottom"
                  title="If this is checked, dice rolling will continue when two participants have the same result"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={roll.uniqueResults}
                        onChange={(e) => {
                          setRolls(
                            rolls.map((p, i) =>
                              index === i
                                ? {
                                    name: p.name,
                                    uniqueResults: e.target.checked,
                                    sides: p.sides,
                                  }
                                : p,
                            ),
                          )
                        }}
                      />
                    }
                    label="Unique results"
                    style={{ marginTop: '10px' }}
                  />
                </Tooltip>

                <TextField
                  label="Dice sides"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setRolls(
                      rolls.map((p, i) =>
                        index === i
                          ? {
                              name: p.name,
                              uniqueResults: p.uniqueResults,
                              sides: parseInt(e.target.value, 10),
                            }
                          : p,
                      ),
                    )
                  }}
                  value={roll.sides}
                  style={{ width: '100px' }}
                />
                <Button
                  onClick={() =>
                    setRolls((rolls) => {
                      return rolls.filter((_p, i) => index !== i)
                    })
                  }
                  variant="outlined"
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </Button>
              </div>
            )
          })}
          <div>
            <Button
              onClick={() => setRolls([...rolls, { name: '', uniqueResults: true, sides: 10 }])}
              variant="outlined"
              style={{ margin: '10px 0' }}
            >
              Add roll
            </Button>
          </div>
        </div>

        <Button
          onClick={onCreate}
          disabled={isPosting}
          variant="outlined"
          style={{ marginTop: '20px' }}
        >
          Create event
        </Button>
      </div>
    </div>
  )
}
