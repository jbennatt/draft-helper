import './PlayerList.css'
import PlayerLabel from '../PlayerLabel/PlayerLabel'
import { useRef } from 'react'
import { Table } from 'react-bootstrap'

const playerListPanel = 'player_list_panel'

export default function PlayerList({ allPlayers, searchValue = '', includeDrafted, draftedMap, setDraftedMap, pickNum, setPickNum }) {

    return (
        <div style={{ width: 'max-content' }} id={playerListPanel}>

            <Table hover size='sm'>
                <thead class='thead-dark'>
                    <tr>
                        <th>Name</th>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>Orig</th>
                        <th>Current</th>
                    </tr>
                </thead>
                <tbody>
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
                </tbody>
            </Table>
        </div>
    )
}

function filterName(playerName, searchValue) {
    return searchValue.trim().length === 0 || playerName.toLowerCase().includes(searchValue.toLowerCase())
}

export function filterPlayers(allPlayers, includeDrafted, draftedMap, searchValue = '') {
    return allPlayers.filter(player => filterName(player.name, searchValue) && (includeDrafted || !draftedMap.get(player.player_id)))
}