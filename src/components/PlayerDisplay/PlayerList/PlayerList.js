import './PlayerList.css'
import PlayerLabel from '../PlayerLabel/PlayerLabel'
import { useRef } from 'react'

const playerListPanel = 'player_list_panel'

export default function PlayerList({ allPlayers, searchValue = '', includeDrafted, draftedMap, setDraftedMap, pickNum, setPickNum }) {

    return (
        <div style={{ width: 'max-content' }} id={playerListPanel}>
            {
                filterPlayers(allPlayers, includeDrafted, draftedMap, searchValue).map(player =>
                    <PlayerLabel
                        player={player}
                        draftedMap={draftedMap} setDraftedMap={setDraftedMap}
                        pickNum={pickNum} setPickNum={setPickNum}
                        key={player.player_id}
                        parentId={playerListPanel}
                    />
                )
            }
        </div>
    )
}

function filterName(playerName, searchValue) {
    return searchValue.trim().length === 0 || playerName.toLowerCase().includes(searchValue.toLowerCase())
}

export function filterPlayers(allPlayers, includeDrafted, draftedMap, searchValue = '') {
    return allPlayers.filter(player => filterName(player.name, searchValue) && (includeDrafted || !draftedMap.get(player.player_id)))
}