import './PlayerList.css'
import PlayerLabel from '../PlayerLabel/PlayerLabel'
import { Table } from 'react-bootstrap'
import { filterPosition } from '../../ControlPanel/ControlPanel'

const playerListPanel = 'player_list_panel'
const noTierFilter = 'ALL'
const allPositions = 'ALL'

export default function PlayerList({ allPlayers, searchValue, includeDrafted, draftedMap, setDraftedMap, pickNum, setPickNum, searchPos, tierFilter }) {

    return (
        <div className='player_list_class' style={{ width: 'max-content' }} id={playerListPanel}>

            <Table hover size='sm'>
                <thead className='thead-dark sticky-top' style={{'zIndex': '1'}}>
                    <tr>
                        <th>Name</th>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>Orig</th>
                        <th>Current</th>
                        <th>Tier</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filterPlayers(allPlayers, includeDrafted, draftedMap, searchPos, searchValue, tierFilter).map(player =>
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

function filterTier(tier, tierFilter) {
    return tierFilter.trim() === noTierFilter || tier === tierFilter
}

export function filterPlayers(allPlayers, includeDrafted, draftedMap, searchPos=allPositions, searchValue = '', tierFilter=noTierFilter) {
    return allPlayers.filter(player => {
        return filterTier(player.tiers, tierFilter) && filterPosition(player, searchPos) && filterName(player.name, searchValue) && (includeDrafted || !draftedMap.get(player.player_id))
    }
    )
}