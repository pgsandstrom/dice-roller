import React, { useState } from 'react'
import { Button, TextField } from '@material-ui/core'
import { DiceRoll } from '../types'
import { validateEventName, validateRoll } from '../util/validateEvent'
import getServerUrl from '../util/serverUrl'
import GoBackWrapper from '../components/goBackWrapper'

export default function CreatePrediction() {
  const [name, setName] = useState('')
  const [rolls, setRolls] = useState<DiceRoll[]>([])

  const [showValidationError, setShowValidationError] = useState(false)

  const [isPosting, setIsPosting] = useState(false)

  const [error, setError] = useState(false)

  const onCreate = async () => {
    if (!validateEventName(name) || !rolls.every((p) => validateRoll(p))) {
      setShowValidationError(true)
      return
    }
    setIsPosting(true)
    try {
      const response = await fetch(`${getServerUrl()}/api/v1/prediction`, {
        method: 'PUT',
        body: JSON.stringify({
          name,
          rolls,
        }),
        credentials: 'same-origin',
      })

      if (response.status < 400) {
        // TODO go to page
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
    <GoBackWrapper>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <TextField
          label="Name"
          multiline
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={showValidationError && !validateEventName(name)}
          helperText={showValidationError && !validateEventName(name) ? 'Invalid ' : ''}
          style={{ marginTop: '10px' }}
        />
        <div
          style={{
            margin: '20px 10px',
          }}
        >
          {rolls.map((roll, index) => {
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <TextField
                  label="Roll name"
                  value={roll.name}
                  onChange={(e) => {
                    setRolls(
                      rolls.map((p, i) =>
                        index === i ? { name: e.target.value, sides: p.sides } : p,
                      ),
                    )
                  }}
                  error={showValidationError && !validateRoll(roll)}
                  helperText={showValidationError && !validateRoll(roll) ? 'Invalid roll' : ''}
                  style={{ flex: '1 0 0' }}
                />

                <TextField
                  label="Dice sides"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setRolls(
                      rolls.map((p, i) =>
                        index === i ? { name: p.name, sides: parseInt(e.target.value, 10) } : p,
                      ),
                    )
                  }}
                  value={roll.sides}
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
              onClick={() => setRolls([...rolls, { name: '', sides: 10 }])}
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
          Create prediction
        </Button>
      </div>
    </GoBackWrapper>
  )
}
