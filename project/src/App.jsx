import { useState, useEffect } from 'react'
import Monetization from './components/monetization/Monetization'
import BalloonClicker from './components/BalloonClicker'

function App() {

  return (
    <Monetization>
      <BalloonClicker />
    </Monetization>
  )
}

export default App