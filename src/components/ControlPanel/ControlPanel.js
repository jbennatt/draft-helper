import './ControlPanel.css'

import { forwardRef } from 'react'
import { Container, Row, Col, Button, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'

import { scrollToAnchorPlayer } from '../ScrollableList/ScrollableList'
import { SearchBar } from './SearchPanel/SearchBar'
import { stripNumFromPos } from '../PlayerDisplay/PlayerLabel/PlayerLabel'

const noTierFilter='ALL'
const allPositions='ALL'

const qb = 'QB'
const rb = 'RB'
const wr = 'WR'
const te = 'TE'
const flex = 'FLEX'
const pk = 'K'
const dst = 'DST'
const positions = [allPositions, qb, rb, wr, te, flex, pk, dst]

const supportedNumTeams = [8, 10, 12]
const supportedTierFilters = [noTierFilter, ...[...Array(16).keys()].map(key => (key + 1).toString())]

function isValidPosFilter(posFilter) {
    return positions.indexOf(posFilter) >= 0
}

function isValidTierFilter(tierFilter) { return supportedTierFilters.indexOf(tierFilter) >= 0 }

export function filterPosition(player, searchPos) {
    if (!isValidPosFilter(searchPos) || searchPos === allPositions) return true

    const strippedPos = stripNumFromPos(player.position)
    return strippedPos === searchPos || (searchPos === flex && (strippedPos === rb || strippedPos === wr || strippedPos == te))
}

const ControlPanel = forwardRef((props, useRefs) => {
    const { pickNum, setPickNum, numTeams, setNumTeams, draftPos, setDraftPos, panelIds, setSearchValue, includeDrafted, setIncludeDrafted,
        searchPos, setSearchPos, tierFilter, setTierFilter } = props
    const computeRound = () => Math.floor((pickNum - 1) / numTeams) + 1
    const computePickInRound = () => ((pickNum - 1) % numTeams) + 1

    const recenterAll = () => {
        panelIds.forEach(panelId => {
            scrollToAnchorPlayer(panelId, useRefs)
        })
    }

    const updateDraftPos = (selectionEvent) => {
        const newDraftPos = parseInt(selectionEvent.target.innerText)
        if (newDraftPos && newDraftPos !== draftPos) setDraftPos(newDraftPos)
        // else do nothing
    }

    const updateNumTeams = (selectionEvent) => {
        const newNumTeams = parseInt(selectionEvent.target.innerText)
        if (newNumTeams && newNumTeams !== numTeams) setNumTeams(newNumTeams)
        // else do nothing
    }

    const updateSearchPos = (selectionEvent) => {
        const newSearchPos = selectionEvent.target.innerText
        // console.log(`newSearchPos: ${newSearchPos}, old search position: ${searchPos}`)
        if (newSearchPos && isValidPosFilter(newSearchPos) && newSearchPos !== searchPos) {
            // console.log(`updating old searchPos ${searchPos} to new search Pos ${newSearchPos}`)
            setSearchPos(newSearchPos)
        }
        // else do nothing
    }

    const updateTierFilter = selectionEvent => {
        const newTierFilter = selectionEvent.target.innerText
        if(newTierFilter && isValidTierFilter(newTierFilter) && newTierFilter !== tierFilter) setTierFilter(newTierFilter)
    }

    const incrementNumPicks = (inc) => {
        const newNumPicks = pickNum + inc
        if (newNumPicks > 0) setPickNum(newNumPicks)
    }

    return (
        <Container fluid id='control_panel'>
            <Row>
                <Col>
                    <h1>Round {computeRound()}.{computePickInRound()}, Pick &#35;{pickNum}</h1>
                </Col>
                <Col>
                    <Button onClick={() => incrementNumPicks(1)} as={ButtonGroup} variant='danger'>Add Pick</Button>
                    <Button onClick={() => incrementNumPicks(-1)} as={ButtonGroup} variant='danger'>Takeaway Pick</Button>
                </Col>
            </Row>
            <Row>
                <Col md='auto'>
                    <SearchBar setSearchValue={setSearchValue} includeDrafted={includeDrafted} setIncludeDrafted={setIncludeDrafted} />
                </Col>
                <Col md='auto'>
                    <DropdownButton title={`Position (${searchPos})`} onClick={updateSearchPos} variant='secondary'>
                        {positions.map(pos =>
                            <Dropdown.Item>{pos}</Dropdown.Item>
                        )}
                    </DropdownButton>
                </Col>
                <Col md='auto'>
                    <DropdownButton title={`Tier (${tierFilter})`} onClick={updateTierFilter} variant='secondary'>
                        {
                            supportedTierFilters.map(tier =>
                                <Dropdown.Item>{tier}</Dropdown.Item>)
                        }
                    </DropdownButton>
                </Col>
                <Col md='auto'>
                    <DropdownButton title={`Number of Teams (${numTeams})`} onClick={updateNumTeams} variant='secondary'>
                        {
                            supportedNumTeams.map(numTeams =>
                                <Dropdown.Item>{numTeams}</Dropdown.Item>
                            )
                        }
                    </DropdownButton>
                </Col>
                <Col md='auto'>
                    <DropdownButton title={`Draft Position (${draftPos})`} onClick={updateDraftPos} variant='secondary'>
                        {
                            [...Array(numTeams).keys()].map(index =>
                                <Dropdown.Item>{index + 1}</Dropdown.Item>
                            )
                        }
                    </DropdownButton>
                </Col>
                <Col md='auto'>
                    <Button variant='primary' onClick={recenterAll}>Recenter</Button>
                </Col>
            </Row>
        </Container>
    )
}
)

export default ControlPanel