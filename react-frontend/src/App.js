import PlayerMultiDisplay from './components/PlayerMultiDisplay/PlayerMultiDisplay';
import './App.css'
import { useState, useEffect } from 'react';

const jsonPath = 'http://jaredbennatt.com/draft-helper/data/json/rankings.json'

const maxPlayers = 300

function getPlayers(data) {
  // code for fantasy football calculator
  // data.players.slice(0, maxPlayers).map((player, index) => {
  //     player.tiers = '1'
  //     player.rank = index + 1
  //     return player
  // })

  // code for fantasy football pros rankings

  // convert FFP JSON to Fantasy Football Calculator JSON schema
  return data.slice(0, maxPlayers).map(player => {
    player.tiers = player.tiers.toString()
    player.name = player.player_name
    player.position = player.pos
    player.adp = player.rk
    player.rank = player.rk
    player.player_id = player.player_name
    return player
  })
}

function App() {
  const [players, setPlayers] = useState(Array(0))

  useEffect(() => {
    fetch(jsonPath)
      .then(response => response.json())
      .then(jsonData => setPlayers(getPlayers(jsonData)))
  })

  return <PlayerMultiDisplay players={players} numRows={2} numCols={3} />
}

export default App;
