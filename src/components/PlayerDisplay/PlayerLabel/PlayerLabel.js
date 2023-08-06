import './PlayerLabel.css'
import { forwardRef } from 'react'

const PlayerLabel = forwardRef((props, allRefs = null) => {
    const { player, draftedMap, setDraftedMap, pickNum, setPickNum, parentId } = props

    return (
        <p
            // I don't understand this function: it's saying that the ref proprety is a function, which takes an "html element as an argument" and 
            //  then sets the useRef property (object definition) as that HTML element
            ref={el => { if (allRefs) allRefs.current[getFullRefId(parentId, player.player_id)] = el }} // by defaullt don't set the ref (allRefs is null)
            className={`player_name ${stripNumFromPos(player.position)} ${draftedMap.get(player.player_id) ? 'drafted' : 'undrafted'} ${player.isYourPick ? 'your_pick' : ''}`}
            onClick={() => togglePlayerDrafted(player.player_id, draftedMap, setDraftedMap, pickNum, setPickNum)}
            key={player.player_id}
        >
            {player.name}-{player.position}-{player.team}-{player.adp}-{player.currentRank}-{player.rank}
        </p>
    )
}
)

export function getFullRefId(parentId, playerId) {
    return `${parentId}_${playerId}`
}

function stripNumFromPos(pos) {
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

export default PlayerLabel