import { NextApiRequest, NextApiResponse } from 'next'
import { finishParticipant } from '../../../server/server'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body) as {
    id: string
    seeds: string[]
  }
  await finishParticipant(body.id, body.seeds)
  res.statusCode = 200
  res.json('done')
}
