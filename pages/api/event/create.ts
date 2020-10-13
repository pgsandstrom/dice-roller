import { NextApiRequest, NextApiResponse } from 'next'
import { createDiceEvent } from '../../../server/server'
import { DiceRoll } from '../../../types'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body) as {
    name: string
    rolls: DiceRoll[]
  }
  const id = await createDiceEvent(body.name, body.rolls)
  res.statusCode = 200
  res.json(id)
}
