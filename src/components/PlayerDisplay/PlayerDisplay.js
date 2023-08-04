import { useState } from 'react'
import PlayerList from './PlayerList/PlayerList'
import './PlayerDisplay.css'

export default function PlayerDisplay({
  players, includeDrafted, setIncludeDrafted, draftedMap, setDraftedMap, pickNum, setPickNum
}) {
  // const [draftedMap, setDraftedMap] = useState(new Map(players.map(
  //   player => [player.player_id, false]
  // )))

  // const [includeDrafted, setIncludeDrafted] = useState(true)
  const [searchValue, setSearchValue] = useState('')

  return (
    <div id='search_panel'>
      <SearchBar setSearchValue={setSearchValue} includeDrafted={includeDrafted} setIncludeDrafted={setIncludeDrafted} />
      <PlayerList
        allPlayers={players} searchValue={searchValue} includeDrafted={includeDrafted} draftedMap={draftedMap} setDraftedMap={setDraftedMap}
        pickNum={pickNum} setPickNum={setPickNum}
      />
    </div>
  );
}

function SearchBar({ setSearchValue, includeDrafted, setIncludeDrafted }) {
  return (
    <div id='search_bar'>
      <input placeholder='Enter Partial Name' onChange={event => setSearchValue(event.target.value)} />
      <label class='drafted_label'>include drafted<input class='drafted_label' checked={includeDrafted} type='checkbox' onChange={() => { setIncludeDrafted(!includeDrafted) }} /></label>
    </div>
  )
}