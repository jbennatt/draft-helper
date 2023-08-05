import { useState, useRef } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'

import ScrollableList from '../ScrollableList/ScrollableList'
import PlayerDisplay from '../PlayerDisplay/PlayerDisplay'
import ControlPanel from '../ControlPanel/ControlPanel'

import './PlayerMultiDisplay.css'
// import data from '../../half-ppr.json'
import data from '../../ffp-rankings-underscores.json'

const maxPlayers = 200

// const players = data.players.slice(0, maxPlayers).map((player, index) => {
//     player.rank = index + 1
//     return player
// })

// convert FFP JSON to Fantasy Football Calculator JSON schema
const players = data.slice(0, maxPlayers).map(player => {
    player.name = player.player_name
    player.position = player.pos
    player.adp = player.rk
    player.rank = player.rk
    player.player_id = player.player_name
    return player
}
)

export default function PlayerMultiDisplay({ numRows, numCols }) {
    const [draftedMap, setDraftedMap] = useState(new Map(players.map(
        player => [player.player_id, false]
    )))

    const [includeDrafted, setIncludeDrafted] = useState(false)

    const [pickNum, setPickNum] = useState(1)
    const [numTeams, setNumTeams] = useState(12)
    const [draftPos, setDraftPos] = useState(7)

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
                ++currentRank

                if (isYourPick(yourPicks, pickNum, currentRank)) {
                    player.isYourPick = true
                    panelIdToAnchorId.set(getPanelId(rowIndex, colIndex), player.player_id)
                    ++colIndex
                    if (colIndex === numCols) {
                        ++rowIndex
                        colIndex = 0
                    }
                }
            }
            return player
        })

        return [enrichedPlayers, panelIdToAnchorId]
    }

    const [enrichedPlayers, panelIdToAnchorId] = enrichPlayers()

    return (
        (
            <Container fluid>
                <Row>
                    <Col md='auto'>
                        <PlayerDisplay
                            players={enrichedPlayers} includeDrafted={includeDrafted} setIncludeDrafted={setIncludeDrafted}
                            draftedMap={draftedMap} setDraftedMap={setDraftedMap}
                            pickNum={pickNum} setPickNum={setPickNum}
                        />
                    </Col>
                    <Col>
                        <Container>
                            <Row>
                                <ControlPanel
                                    pickNum={pickNum} setPickNum={setPickNum}
                                    numTeams={numTeams} setNumTeams={setNumTeams}
                                    draftPos={draftPos} setDraftPos={setDraftPos}
                                    panelIds={panelIds}
                                    ref={useRefs}
                                />
                            </Row>
                            <Row>
                                <Container>
                                    {
                                        [...Array(numRows).keys()].map(rowIndex => (
                                            <Row key={`panel_row_${rowIndex}`}>
                                                {
                                                    [...Array(numCols).keys()].map(colIndex => (
                                                        <Col key={`panel_row_col_${rowIndex}_${colIndex}`}>
                                                            <Card key={`card_parent_${rowIndex}_${colIndex}`}>
                                                                <Card.Body key={`card_body_${rowIndex}_${colIndex}`}>
                                                                    <ScrollableList
                                                                        ref={useRefs}
                                                                        id={getPanelId(rowIndex, colIndex)}
                                                                        anchorPlayerId={panelIdToAnchorId.get(getPanelId(rowIndex, colIndex))}
                                                                        players={enrichedPlayers}
                                                                        includeDrafted={includeDrafted}
                                                                        draftedMap={draftedMap} setDraftedMap={setDraftedMap}
                                                                        pickNum={pickNum} setPickNum={setPickNum}
                                                                        key={getPanelId(rowIndex, colIndex)}
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
                            </Row>
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

    const unit = [...Array(maxRoundsForCompute).keys()].forEach(roundIndex => {
        // indexes are 0-indexed, so "even" round are really the odd rounds
        if (roundIndex % 2 === 0) currPick += 2 * (numTeams - draftPos) + 1
        else currPick += 2 * draftPos - 1

        yourPicks.push(currPick)
    })

    return new Set(yourPicks)
}

function isYourPick(yourPicks, pickNum, currentRank) {
    return yourPicks.has(pickNum + currentRank - 1)
}