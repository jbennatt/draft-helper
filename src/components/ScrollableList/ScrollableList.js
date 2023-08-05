import { forwardRef } from 'react';
import './ScrollableList.css'
import PlayerLabel from '../PlayerDisplay/PlayerLabel/PlayerLabel';
import { filterPlayers } from '../PlayerDisplay/PlayerList/PlayerList';
import { getFullRefId } from '../PlayerDisplay/PlayerLabel/PlayerLabel';



const ScrollableList = forwardRef((props, useRefs) => {
    const { id, players, draftedMap, setDraftedMap, includeDrafted, pickNum, setPickNum, anchorPlayerId } = props

    return (
        <div className="app">
            <div className="scroller" id={id} ref={el => useRefs[id] = el} anchorPlayerId={anchorPlayerId}>
                {filterPlayers(players, includeDrafted, draftedMap).map(player => {
                    return (
                        <PlayerLabel
                            ref={useRefs}
                            key={player.player_id}
                            player={player}
                            draftedMap={draftedMap} setDraftedMap={setDraftedMap}
                            pickNum={pickNum} setPickNum={setPickNum}
                            parentId={id}
                        />
                    );
                })}
            </div>
        </div>
    )
}
)

const anchorPlayerDrop = 200

export function scrollToAnchorPlayer(scrollerDivId, useRefs) {
    const anchorPlayerId = useRefs[scrollerDivId].getAttribute("anchorPlayerId")
    const useRefKey = getFullRefId(scrollerDivId, anchorPlayerId)

    let top = useRefs.current[useRefKey].offsetTop

    if (top < anchorPlayerDrop) top = 0 // don't scroll at all
    else top -= anchorPlayerDrop

    useRefs[scrollerDivId].scrollTo({
        left: 0,
        top: top,
        behavior: 'smooth',
    }
    )
}

export default ScrollableList