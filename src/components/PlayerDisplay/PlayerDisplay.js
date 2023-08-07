import { useState } from 'react'
import PlayerList from './PlayerList/PlayerList'
import './PlayerDisplay.css'

export default function PlayerDisplay({ players, includeDrafted, draftedMap, setDraftedMap, pickNum, setPickNum, searchValue }) {
    return (
    <div id='search_panel'>
      {/* <SearchBar setSearchValue={setSearchValue} includeDrafted={includeDrafted} setIncludeDrafted={setIncludeDrafted} /> */}
      <PlayerList
        allPlayers={players} searchValue={searchValue} includeDrafted={includeDrafted} draftedMap={draftedMap} setDraftedMap={setDraftedMap}
        pickNum={pickNum} setPickNum={setPickNum}
      />
    </div>
  );
}