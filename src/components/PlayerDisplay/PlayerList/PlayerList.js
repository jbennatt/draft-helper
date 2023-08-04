import './PlayerList.css'
import PlayerLabel from '../PlayerLabel/PlayerLabel'
import { useRef } from 'react'

export default function PlayerList({ 
    allPlayers, searchValue = '', includeDrafted, draftedMap, setDraftedMap, pickNum, setPickNum 
}) {
    const useRefs = useRef({})

    return (
        <div style={{ width: 'max-content' }}>
            {
                filterPlayers(allPlayers, includeDrafted, draftedMap, searchValue).map(player => 
                    <PlayerLabel 
                    player={player}
                    draftedMap={draftedMap} setDraftedMap={setDraftedMap}
                    pickNum={pickNum} setPickNum={setPickNum}
                    ref={useRefs}
                    key={player.player_id}
                    />
                    // <p
                    //     className={`player_name ${position} ${draftedMap.get(player_id) ? 'drafted' : 'undrafted'}`}
                    //     onClick={() => togglePlayerDrafted(player_id, draftedMap, setDraftedMap)}
                    //     key={player_id}
                    // >
                    //     {name}-{position}-{team}-{adp}-{rank}
                    // </p>
                )
            }
        </div>
    )
}

function filterName(playerName, searchValue) {
    return searchValue.trim().length === 0 || playerName.toLowerCase().includes(searchValue.toLowerCase())
}

export function filterPlayers(allPlayers, includeDrafted, draftedMap, searchValue='') {
    return allPlayers.filter(player => filterName(player.name, searchValue) && (includeDrafted || !draftedMap.get(player.player_id)))
}