import Menu from '../components/Menu'
import {Link} from 'react-router-dom'

function Teamanswer() {
    return (
        <div>
            <div className="main">
                <div className='logout-btn-container'><button className="logout-btn">LOGI VÄLJA</button></div>
                {/* <h1>Tulemuste edetabel</h1> */}
                <br />
                <br />
                <div className="infoContainer">
                    <h2>Tiimi nimi</h2>
                    <br />
                    <div>Tiimi liikmete nimed..</div>
                    <br />
                    <div className="details">
                        <div>videolink</div>
                    </div>
                </div>
                <div>
                    <div></div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Küsimused</th>
                            <th>Vastused</th>
                            <th>Punktid</th>

                        </tr>
                    </thead>
                    <tbody>
                        <td>küs 1</td>
                        <td>vastus</td>
                        <td>20p</td>

                    </tbody>
                    <tbody>=Punktid kokku</tbody>
                </table>
                <br />
                <br />
                <br />
            </div>
            <Link to={"/"} >
                <div className='res-btn-container'><button className='res-btn'>TAGASI VASTUSTE JUURDE</button></div>
            </Link>
        </div>
    )
}

export default Teamanswer