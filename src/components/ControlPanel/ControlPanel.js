import './ControlPanel.css'

import { forwardRef } from 'react'
import { Container, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap'

import { scrollToAnchorPlayer } from '../ScrollableList/ScrollableList'

const supportedNumTeams = [8, 10, 12]
const supportedFormats = ['half-point PPR']

const ControlPanel = forwardRef((props, useRefs) => {
    const { pickNum, setPickNum, numTeams, setNumTeams, draftPos, setDraftPos, panelIds } = props
    const computeRound = () => Math.floor((pickNum - 1) / numTeams) + 1
    const computePickInRound = () => ((pickNum - 1) % numTeams) + 1

    const recenterAll = () => {
        panelIds.forEach(panelId => {
            console.log(`trying to recenter: ${panelId}`)
            scrollToAnchorPlayer(panelId, useRefs)
        })
    }

    const updateDraftPos = (selectionEvent) => {
        const newDraftPos = parseInt(selectionEvent.target.innerText)
        if (newDraftPos && newDraftPos != draftPos) setDraftPos(newDraftPos)
        // else do nothing
    }

    const updateNumTeams = (selectionEvent) => {
        const newNumTeams = parseInt(selectionEvent.target.innerText)
        if (newNumTeams && newNumTeams != numTeams) setNumTeams(newNumTeams)
        // else do nothing
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h1>Round {computeRound()}.{computePickInRound()}, Pick &#35;{pickNum}</h1>
                </Col>
            </Row>
            <Row>
                {/* <Col>
                    <Button variant='primary'>update</Button>
                </Col>
                <Col>
                    <DropdownButton title='Select Team Type'>
                        {
                            supportedFormats.map(format =>
                                <Dropdown.Item>{format}</Dropdown.Item>
                            )
                        }
                    </DropdownButton>
                </Col> */}
                <Col md='auto'>
                    <DropdownButton title={`Number of Teams (currently ${numTeams})`} onClick={updateNumTeams}>
                        {
                            supportedNumTeams.map(numTeams =>
                                <Dropdown.Item>{numTeams}</Dropdown.Item>
                            )
                        }
                    </DropdownButton>
                </Col>
                <Col md='auto'>
                    <DropdownButton title={`Set Draft Position (currently ${draftPos}`} onClick={updateDraftPos}>
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