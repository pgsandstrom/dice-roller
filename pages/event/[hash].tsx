import { GetServerSideProps } from 'next'
import GoBackWrapper from '../../components/goBackWrapper'
import { getDiceEvent } from '../../server/server'
import { DiceEvent } from '../../types'
import DiceEventView from '../../components/DiceEventView'

export const getServerSideProps: GetServerSideProps<DiceEventProps> = async (context) => {
  const hash = context.params!.hash as string
  const diceEvent: DiceEvent = await getDiceEvent(hash)
  return {
    props: {
      diceEvent,
    },
  }
}

interface DiceEventProps {
  diceEvent?: DiceEvent
}

export default function DiceEventHashView({ diceEvent }: DiceEventProps) {
  return (
    <GoBackWrapper>
      {diceEvent ? <DiceEventView diceEvent={diceEvent} /> : <div>event not found</div>}
    </GoBackWrapper>
  )
}
