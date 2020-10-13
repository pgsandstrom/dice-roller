import { NextApiRequest, NextApiResponse } from 'next'
import { createParticipation } from '../../../server/server'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body) as {
    eventId: string
  }
  const eventParticipantHashed = await createParticipation(body.eventId)
  res.statusCode = 200
  res.json(eventParticipantHashed)
}
