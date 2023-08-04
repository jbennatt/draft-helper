// import data from './half-ppr.json'
import PlayerDisplay from './components/PlayerDisplay/PlayerDisplay'
import ScrollableList from './components/ScrollableList/ScrollableList';
import { Container, Row, Col } from 'react-bootstrap';
import PlayerMultiDisplay from './components/PlayerMultiDisplay/PlayerMultiDisplay';
import './App.css'


function App() {
  // const noDraftedMap = new Map(players.map(
  //   player => [player.player_id, false]
  // ))

  return (
    <PlayerMultiDisplay numRows={2} numCols={3} />

    // <PlayerDisplay players={data.players}/>

    // <Container>
    //   <Row>
    //     <Col>
    //       <ScrollableList id='1'/>
    //       {/* <PlayerDisplay players={data.players} /> */}
    //     </Col>
    //     <Col>
    //       {/* <PlayerDisplay players={data.players} /> */}
    //       <ScrollableList id='2'/>
    //     </Col>
    //   </Row>
    // </Container>

    // <div className='panel panel-default'>
    //   <div className='panel-heading'>Players</div>
    //   <div className='panel-body'>
    //     {/* <ScrollableList /> */}
    //     <PlayerDisplay players={data.players} />
    //   </div>
    // </div>
  );
}

export default App;
