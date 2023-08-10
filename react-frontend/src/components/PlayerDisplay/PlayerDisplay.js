import PlayerList from './PlayerList/PlayerList'
import './PlayerDisplay.css'

export default function PlayerDisplay({ players, includeDrafted, draftedMap, setDraftedMap, pickNum, setPickNum, searchValue, searchPos, tierFilter }) {
    return (
    <div id='search_panel'>
      <PlayerList
        allPlayers={players} searchValue={searchValue} includeDrafted={includeDrafted} draftedMap={draftedMap} setDraftedMap={setDraftedMap}
        pickNum={pickNum} setPickNum={setPickNum}
        searchPos={searchPos}
        tierFilter={tierFilter}
      />
    </div>
  );
}