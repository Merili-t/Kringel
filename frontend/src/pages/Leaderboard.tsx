import Menu from '../components/Menu'
import {Link} from 'react-router-dom'
function Leaderboard() {
  return (
    <div>
        <Menu/>
        <div className="main">
        <div className='logout-btn-container'><button className="logout-btn">LOGI VÄLJA</button></div>
        <h1>Tulemuste edetabel</h1>
        <br />
        <br />
        <div className="infoContainer">
          <h2>Testi nimi</h2>
        <br />
        <div>Kirjeldus..</div>
        <br />
        <div className="details">
          <div>.. küsimust</div>
          <div>12/04/25</div>
          <div>osalejaid:54 tiimi</div>
        </div>
        </div>
        <div>
          <div></div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Koht</th>
              <th>Tiim</th>
              <th>Vastatud küsimused</th>
              <th>Punktid</th>
            </tr>
          </thead>
          <tbody>
            <td>1.</td>
            <td>Nimi</td>
            <td>5/5</td>
            <td>100%</td>            
          </tbody>
        </table>
        <br />
        <br />
        <br />        
      </div>
      <Link to={"/"} ><div className='res-btn-container'><button className='res-btn'>TAGASI VASTUSTE JUURDE</button></div></Link>
      </div>
  )
}

export default Leaderboard