import { GetServerSideProps } from 'next'
import GoBackWrapper from '../components/goBackWrapper'
import { getDiceEvent } from '../server/server'
import { DiceEvent } from '../types'
import DiceEventView from '../components/DiceEventView'

export const getServerSideProps: GetServerSideProps<DiceEventProps> = async (context) => {
  const id = context.params!.id as string
  const diceEvent = await getDiceEvent(id)
  return {
    props: {
      diceEvent: diceEvent ?? null,
    },
  }
}

interface DiceEventProps {
  diceEvent: DiceEvent | null
}

export default function DiceEventHashView({ diceEvent }: DiceEventProps) {
  return (
    <GoBackWrapper>
      {diceEvent ? <DiceEventView diceEvent={diceEvent} /> : <div>event not found</div>}
    </GoBackWrapper>
  )
}
