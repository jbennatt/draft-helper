import { useState, useRef } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'

import ScrollableList from '../ScrollableList/ScrollableList'
import PlayerDisplay from '../PlayerDisplay/PlayerDisplay'
import ControlPanel from '../ControlPanel/ControlPanel'

import './PlayerMultiDisplay.css'

export const noTierFilter = 'ALL'
export const allPositions = 'ALL'

export default function PlayerMultiDisplay({ players, numRows, numCols }) {
    const [draftedMap, setDraftedMap] = useState(new Map(players.map(
        player => [player.player_id, false]
    )))

    const [includeDrafted, setIncludeDrafted] = useState(false)

    const [pickNum, setPickNum] = useState(1)
    const [numTeams, setNumTeams] = useState(12)
    const [draftPos, setDraftPos] = useState(7)
    const [searchValue, setSearchValue] = useState('')
    const [searchPos, setSearchPos] = useState(allPositions)
    const [tierFilter, setTierFilter] = useState(noTierFilter)

    const useRefs = useRef({})

    const panelIds = [...Array(numRows).keys()].flatMap(rowIndex =>
        [...Array(numCols).keys()].map(colIndex => getPanelId(rowIndex, colIndex)
        )
    )

    const enrichPlayers = () => {
        const panelIdToAnchorId = new Map()
        const yourPicks = getYourPickNums(draftPos, numTeams)
        let rowIndex = 0
        let colIndex = 0
        let currentRank = 1

        const enrichedPlayers = players.map(player => {
            player.currentRank = 0
            player.isYourPick = false

            if (!draftedMap.get(player.player_id)) {
                player.currentRank = currentRank

                // if this player isn't drafted, check to see if they're part of your picks
                if (isYourPick(yourPicks, pickNum, currentRank)) {
                    player.isYourPick = true
                    panelIdToAnchorId.set(getPanelId(rowIndex, colIndex), player.player_id)
                    ++colIndex
                    if (colIndex === numCols) {
                        ++rowIndex
                        colIndex = 0
                    }
                }

                // increment current rank after above decision
                ++currentRank
            }
            return player
        })

        return [enrichedPlayers, panelIdToAnchorId]
    }

    const [enrichedPlayers, panelIdToAnchorId] = enrichPlayers()

    return (
        (
            <Container fluid>
                {
                    /**
                     * Main container consists of two rows:
                     * 
                     * Top row (here): single column: Control Panel
                     * Bottom Row: two columns: first is side panel (main search) and second (to the right) is a Container
                     *  that shows a grid of the draft round selections (responsive to RECENTER)
                     */
                }
                <Row>
                    <ControlPanel
                        pickNum={pickNum} setPickNum={setPickNum}
                        numTeams={numTeams} setNumTeams={setNumTeams}
                        draftPos={draftPos} setDraftPos={setDraftPos}
                        panelIds={panelIds}
                        setSearchValue={setSearchValue}
                        includeDrafted={includeDrafted} setIncludeDrafted={setIncludeDrafted}
                        searchPos={searchPos} setSearchPos={setSearchPos}
                        tierFilter={tierFilter} setTierFilter={setTierFilter}
                        ref={useRefs}
                    />
                </Row>
                <Row>
                    <Col md='auto'>
                        <PlayerDisplay
                            players={enrichedPlayers} includeDrafted={includeDrafted} setIncludeDrafted={setIncludeDrafted}
                            draftedMap={draftedMap} setDraftedMap={setDraftedMap}
                            pickNum={pickNum} setPickNum={setPickNum}
                            searchValue={searchValue}
                            searchPos={searchPos}
                            tierFilter={tierFilter}
                        />
                    </Col>
                    <Col>
                        <Container>
                            {
                                [...Array(numRows).keys()].map(rowIndex => (
                                    <Row key={`panel_row_${rowIndex}`}>
                                        {
                                            [...Array(numCols).keys()].map(colIndex => (
                                                <Col key={`panel_row_col_${rowIndex}_${colIndex}`}>
                                                    <Card>
                                                        <Card.Body>
                                                            <ScrollableList
                                                                ref={useRefs}
                                                                id={getPanelId(rowIndex, colIndex)}
                                                                anchorPlayerId={panelIdToAnchorId.get(getPanelId(rowIndex, colIndex))}
                                                                players={enrichedPlayers}
                                                                includeDrafted={includeDrafted}
                                                                draftedMap={draftedMap} setDraftedMap={setDraftedMap}
                                                                pickNum={pickNum} setPickNum={setPickNum}
                                                            />
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            )
                                            )
                                        }
                                    </Row>
                                )
                                )
                            }
                        </Container>
                    </Col>
                </Row>
            </Container >
        )
    )
}

const maxRoundsForCompute = 30
const scrollerDivBase = 'scrolling_div'

function getPanelId(rowIndex, colIndex) {
    return `${scrollerDivBase}_${rowIndex}_${colIndex}`
}

function getYourPickNums(draftPos, numTeams) {
    const yourPicks = [draftPos]
    let currPick = draftPos
    let roundIndex = 1

    while(roundIndex <= maxRoundsForCompute) {
        if (roundIndex % 2 === 1) currPick += 2 * (numTeams - draftPos) + 1
        else currPick += 2 * draftPos - 1

        yourPicks.push(currPick)
        ++roundIndex
    }

    return new Set(yourPicks)
}

function isYourPick(yourPicks, pickNum, currentRank) {
    return yourPicks.has(pickNum + currentRank - 1)
}