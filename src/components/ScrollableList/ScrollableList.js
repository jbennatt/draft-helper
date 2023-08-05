import { forwardRef } from 'react';
import './ScrollableList.css'
import PlayerLabel from '../PlayerDisplay/PlayerLabel/PlayerLabel';
import { filterPlayers } from '../PlayerDisplay/PlayerList/PlayerList';
import { Button } from 'react-bootstrap';
import { getFullRefId } from '../PlayerDisplay/PlayerLabel/PlayerLabel';



const ScrollableList = forwardRef((props, useRefs) => {
    const { id, players, draftedMap, setDraftedMap, includeDrafted, pickNum, setPickNum, anchorPlayerId } = props
    // const useRefs = useRef({})

    // const scrollToAnchorPlayer = () => {
    //     let top = useRefs.current[anchorPlayerId].offsetTop
    //     if (top < anchorPlayerDrop) top = 0
    //     else top -= anchorPlayerDrop

    //     document.getElementById(scrollerDivId).scrollTo({
    //         left: 0,
    //         top: top,
    //         behavior: 'smooth',
    //     }
    //     )
    // }

    return (
        <div className="app">
            <Button variant='primary' onClick={() => scrollToAnchorPlayer(id, useRefs)}>Re-Center</Button>
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
                        // <div className="item" ref={el => useRefs.current[player_id] = el} key={player_id} onClick={() => scrollToRef(player_id)}>
                        //     <p>{name}-{position}-{adp}</p>
                        // </div>
                    );
                })}
            </div>
        </div>
    )
}
)

const anchorPlayerDrop = 250

export function scrollToAnchorPlayer(scrollerDivId, useRefs) {
    const playerId = useRefs[scrollerDivId].getAttribute("anchorPlayerId")
    const useRefKey = getFullRefId(scrollerDivId, playerId)
    let top = useRefs.current[useRefKey].offsetTop
    if (top < anchorPlayerDrop) top = 0
    else top -= anchorPlayerDrop

    console.log(`trying to scroll div: ${scrollerDivId}`)

    useRefs[scrollerDivId].scrollTo({
        left: 0,
        top: top,
        behavior: 'smooth',
    }
    )
}

export default ScrollableList