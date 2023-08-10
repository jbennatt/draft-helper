import './PlayerLabel.css'
import { forwardRef } from 'react'

export const valueHeader = 'Value'

export const fields = [
    { header: 'Name', playerKey: 'name' },
    { header: 'Pos', playerKey: 'position' },
    { header: 'Team', playerKey: 'team' },
    { header: 'Current', playerKey: 'currentRank' },
    { header: valueHeader, playerKey: 'rank' }
    // { header: 'Tier', playerKey: 'tiers' }
]

const PlayerLabel = forwardRef((props, allRefs) => {
    const { player, draftedMap, setDraftedMap, pickNum, setPickNum, parentId } = props

    return (
        <tr
            // I don't understand this function: it's saying that the ref proprety is a function, which takes an "html element as an argument" and 
            //  then sets the useRef property (object definition) as that HTML element
            ref={el => { if (allRefs) allRefs.current[getFullRefId(parentId, player.player_id)] = el }} // by defaullt don't set the ref (allRefs is null)
            className={`player_label ${getBSRowClass(stripNumFromPos(player.position))} ${draftedMap.get(player.player_id) ? 'drafted' : 'undrafted'} 
            ${player.isYourPick ? 'your_pick' : ''}`}
            onClick={() => togglePlayerDrafted(player.player_id, draftedMap, setDraftedMap, pickNum, setPickNum)}
        >
            {
                fields.map(field => {
                    if (field.header !== valueHeader) return <td key={field.playerKey}>{player[field.playerKey]}</td>
                    else return <td key={field.playerKey}>{player[field.playerKey] - pickNum + 1}</td>
                    
                })
            }
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
    switch (pos.trim().toUpperCase()) {
        case 'WR': return 'table-success'
        case 'RB': return 'table-primary'
        case 'TE': return 'table-warning'
        case 'QB': return 'table-danger'
        case 'DEF':
        case 'DST':
            return 'table-info'
        case 'PK':
        case 'K':
            return 'table-secondary'
        default: return 'table-light'
    }
}

export default PlayerLabel