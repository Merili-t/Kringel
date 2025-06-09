import { useEffect, useState } from 'react'

import type { Test } from '../models/Test';
//import logo from '../assets/logo.png'
import Menu from './components/Menu';
import del from '../assets/del.png'
import { Link } from 'react-router-dom';

function Testanswer() {
    const [tests, setTests] = useState<Test[]>([]);
    useEffect(() => {
        fetch("http://localhost:8080/tests") //API kuhu läheb päring
            .then(res => res.json())
            .then(json => setTests(json))
    }, []);
    return (
        <div>
            <Menu/>
            <div className="main">
                <div className='logout-btn-container'><button className="logout-btn">LOGI VÄLJA</button></div>
                <h1>Vastused</h1>
                <br />
                <br />
                {tests.map(test =>
                    <div key={test.id}>
                        <div className="infoContainer">
                            <h2>{test.name}</h2>
                            <br />
                            <div>{test.description}</div>
                            <br />
                            <div className="details">
                                <div>.. küsimust</div>
                                <div>kp</div>
                                <div>osalejaid:54 tiimi</div>

                            </div>
                        </div>
                    </div>)}

                <div>
                    <div></div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th><input type="checkbox" /></th>
                            <th>Tiim</th>
                            <th>Vastatud küsimused</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>


                        <td><input type="checkbox" /></td>
                        <td>Nimi</td>
                        <td>5/5</td>
                        <td><button className='delete-btn'><img src={del} alt="Delete" className='del' /></button></td>

                    </tbody>
                </table>
                <br />
                <br />
                <br />

            </div>
            <Link to={"/"} >
                <div className='res-btn-container'><button className='res-btn'>TULEMUSTE EDETABEL</button></div>
            </Link>
        </div>
    )
}

export default Testanswer