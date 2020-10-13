import { GetServerSideProps } from 'next'
import GoBackWrapper from '../components/goBackWrapper'
import { getDiceEvent, getParticipantComplete } from '../server/server'
import { DiceEvent, EventParticipantComplete } from '../types'
import DiceEventView from '../components/DiceEventView'

export const getServerSideProps: GetServerSideProps<DiceEventProps> = async (context) => {
  const id = context.params!.id as string
  const diceEvent = await getDiceEvent(id)
  const participantComplete = await getParticipantComplete(id)

  return {
    props: {
      diceEvent: diceEvent ?? null,
      participantComplete: participantComplete,
    },
  }
}

interface DiceEventProps {
  diceEvent: DiceEvent | null
  participantComplete: EventParticipantComplete[]
}

export default function DiceEventIdView({ diceEvent, participantComplete }: DiceEventProps) {
  return (
    <GoBackWrapper>
      {diceEvent ? (
        <DiceEventView diceEvent={diceEvent} participantComplete={participantComplete} />
      ) : (
        <div>event not found</div>
      )}
    </GoBackWrapper>
  )
}
