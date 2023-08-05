// import data from './half-ppr.json'
import PlayerDisplay from './components/PlayerDisplay/PlayerDisplay'
import ScrollableList from './components/ScrollableList/ScrollableList';
import { Container, Row, Col } from 'react-bootstrap';
import PlayerMultiDisplay from './components/PlayerMultiDisplay/PlayerMultiDisplay';
import './App.css'


function App() {
  return <PlayerMultiDisplay numRows={2} numCols={3} />
}

export default App;
