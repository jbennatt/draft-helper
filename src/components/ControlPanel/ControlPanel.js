import './ControlPanel.css'

import { forwardRef } from 'react'
import { Container, Row, Col, Button, Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'

import { scrollToAnchorPlayer } from '../ScrollableList/ScrollableList'

const supportedNumTeams = [8, 10, 12]

const ControlPanel = forwardRef((props, useRefs) => {
    const { pickNum, setPickNum, numTeams, setNumTeams, draftPos, setDraftPos, panelIds } = props
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