import { forwardRef } from 'react';
import './ScrollableList.css'

import { filterPlayers } from '../PlayerDisplay/PlayerList/PlayerList';
import PlayerLabel from '../PlayerDisplay/PlayerLabel/PlayerLabel';
import { getFullRefId, fields } from '../PlayerDisplay/PlayerLabel/PlayerLabel';

import { Table } from 'react-bootstrap';



const ScrollableList = forwardRef((props, allRefs) => {
    const { id, players, draftedMap, setDraftedMap, includeDrafted, pickNum, setPickNum, anchorPlayerId } = props

    return (
        <div className="app">
            <div className="scroller" id={id} ref={el => allRefs.current[id] = el} anchor_player_id={anchorPlayerId}>
                <Table hover size='sm'>
                    <thead className='thead-dark sticky-top' style={{ 'zIndex': '1' }}>
                        <tr>
                            {fields.map(field => (
                                <th key={field.header}>{field.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filterPlayers(players, includeDrafted, draftedMap).map(player =>
                            <PlayerLabel
                                ref={allRefs}
                                key={player.player_id}
                                player={player}
                                draftedMap={draftedMap} setDraftedMap={setDraftedMap}
                                pickNum={pickNum} setPickNum={setPickNum}
                                parentId={id}
                            />
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}
)

const anchorPlayerDrop = 150

export function scrollToAnchorPlayer(scrollerDivId, allRefs) {
    const scrollerDiv = allRefs.current[scrollerDivId]
    const anchorPlayerId = scrollerDiv.getAttribute("anchor_player_id")
    const refKeyToPlayerLabel = getFullRefId(scrollerDivId, anchorPlayerId)

    const playerLabelInScroll = allRefs.current[refKeyToPlayerLabel]

    let top = playerLabelInScroll.offsetTop

    if (top < anchorPlayerDrop) top = 0 // don't scroll at all
    else top -= anchorPlayerDrop

    scrollerDiv.scrollTo({
        left: 0,
        top: top,
        behavior: 'smooth',
    }
    )
}

export default ScrollableList