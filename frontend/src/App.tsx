

import './App.css'
import { /* Link, */ Route, Routes } from 'react-router-dom';
import Leaderboard from './pages/Leaderboard';
import Teamanswer from './pages/Teamanswer';
import Testanswer from './pages/Testanswer';

function App() {
 

  return (
    <>
      <Routes>
        <Route path="/leaderboard" element ={<Leaderboard/>} />
        <Route path="/teamanswers" element ={<Teamanswer/>} />
        <Route path="/testanswers" element ={<Testanswer/>} />
      </Routes>
    </>
  )
}

export default App
