import './ControlPanel.css'

import { forwardRef } from 'react'
import { Container, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap'

import { scrollToAnchorPlayer } from '../ScrollableList/ScrollableList'

const supportedNumTeams = [8, 10, 12]
const supportedFormats = ['half-point PPR']

const ControlPanel = forwardRef((props, useRefs) => {
    const { pickNum, setPickNum, numTeams, setNumTeams, draftPos, setDraftPos, panelIdToAnchorPlayer } = props
    const computeRound = () => Math.floor((pickNum - 1) / numTeams) + 1
    const computePickInRound = () => ((pickNum - 1) % numTeams) + 1

    // const recenterAll = () => {
    //     for(const panelId of panelIdToAnchorPlayer.keys()) {
    //         console.log(`anchor id: ${panelIdToAnchorPlayer.get(panelId)}`)
    //         scrollToAnchorPlayer(document, panelId, panelIdToAnchorPlayer.get(panelId), useRefs)
    //     }
    // }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h1>Round {computeRound()}:{computePickInRound()}, &#35;{pickNum}</h1>
                </Col>
            </Row>
            <Row>
                <Col>
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
                </Col>
                <Col>
                    <DropdownButton title={`Number of Teams (currently ${numTeams})`}>
                        {
                            supportedNumTeams.map(numTeams =>
                                <Dropdown.Item>{numTeams}</Dropdown.Item>
                            )
                        }
                    </DropdownButton>
                </Col>
                <Col>
                    <DropdownButton title={`Set Draft Position (currently ${draftPos}`}>
                        {
                            [...Array(numTeams).keys()].map(index =>
                                <Dropdown.Item>{index + 1}</Dropdown.Item>
                            )
                        }
                    </DropdownButton>
                </Col>
                {/* <Col>
                    <Button variant='primary' onClick={recenterAll}>Recenter-All</Button>
                </Col> */}
            </Row>
        </Container>
    )
}
)

export default ControlPanel


{/* <div>
<h1>This is where the control options and reset will go</h1>
<ul>
    <li>
        Reset draft
    </li>
    <li>
        Display Round, pick number, how many picks until next pick
    </li>
    <li>
        Set Draft Position (dynamic--should be able to change while in draft)
    </li>
    <li>
        Set number of Teams
    </li>
    <li>
        re-download from fantasy football calculator
    </li>
    <li>
        specify league type
    </li>
    <li>
        add pick/remove pick (for no-name players)
    </li>
</ul>
</div> */}