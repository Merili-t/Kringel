import React from 'react'

function Menu() {
  return (
    <div>
        <div className="menu">
        <a><img src={logo} alt="Logo" className="logo" /></a>
        <br />
        <a><button className="red-btn">TESTI KOOSTAMINE</button></a>
        <br />
        <a><button className="btn">AVALEHELE</button></a>
        <br />
        <a><button className="btn">JUHEND</button></a>
        <br />
        <a><button className="btn">KONTAKTANDMED</button></a>
      </div> 
    </div>
  )
}

export default Menu