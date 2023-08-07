import './PlayerLabel.css'
import { forwardRef } from 'react'

const PlayerLabel = forwardRef((props, allRefs = null) => {
    const { player, draftedMap, setDraftedMap, pickNum, setPickNum, parentId } = props

    return (
        <tr
            // I don't understand this function: it's saying that the ref proprety is a function, which takes an "html element as an argument" and 
            //  then sets the useRef property (object definition) as that HTML element
            ref={el => { if (allRefs) allRefs.current[getFullRefId(parentId, player.player_id)] = el }} // by defaullt don't set the ref (allRefs is null)
            class={`player_label ${getBSRowClass(stripNumFromPos(player.position))} ${draftedMap.get(player.player_id) ? 'drafted' : 'undrafted'} 
            ${player.isYourPick ? 'your_pick' : ''}`}
            // className={`player_name ${stripNumFromPos(player.position)} ${draftedMap.get(player.player_id) ? 'drafted' : 'undrafted'} ${player.isYourPick ? 'your_pick' : ''}`}
            // className={`${draftedMap.get(player.player_id) ? 'drafted' : 'undrafted'} ${player.isYourPick ? 'your_pick' : ''}`}
            onClick={() => togglePlayerDrafted(player.player_id, draftedMap, setDraftedMap, pickNum, setPickNum)}
            key={player.player_id}
        >
            <td>{player.name}</td>
            <td>{player.position}</td>
            <td>{player.team}</td>
            <td>{player.rank}</td>
            <td>{player.currentRank}</td>
        </tr>
    )
}
)

export function getFullRefId(parentId, playerId) {
    return `${parentId}_${playerId}`
}

export function stripNumFromPos(pos) {
    const strippedPos = pos.replace(/[0-9]/g, '')
    return strippedPos
}

function togglePlayerDrafted(playerId, draftedMap, setDraftedMap, pickNum = null, setPickNum = null) {
    const drafted = draftedMap.get(playerId)
    if (pickNum && setPickNum) {
        if (drafted) setPickNum(pickNum - 1)
        else setPickNum(pickNum + 1)
    }
    draftedMap.set(playerId, !drafted)
    setDraftedMap(new Map(draftedMap))
}

function getBSRowClass(pos) {
    switch(pos.trim().toUpperCase()) {
        case 'WR': return 'table-success'
        case 'RB': return 'table-primary'
        case 'TE': return 'table-warning'
        case 'QB': return 'table-danger'
        case 'DEF', 'DST': return 'table-info'
        case 'PK', 'K': return 'table-secondary'
        default: return 'table-light'
    }
}

export default PlayerLabel