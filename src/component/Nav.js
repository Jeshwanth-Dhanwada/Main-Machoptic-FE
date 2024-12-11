import React,{useState} from "react";
import { FiLogOut } from "react-icons/fi";
const  Navbar = ({ activePage }) => {
  console.log(activePage)
    return(
    <nav className="navbar">
      <div 
          className="navbar-container"
          style={{width:'100%',
                  height:'50px',
                  backgroundColor:'#fc9445',
                  // #ec2227 #fc9445 
                  marginTop:'-10px',
                  justifyItems:'center',
                  alignItems:'center',
                  color:'white',

                    }}
          >
          {/* <ul className="navbar-nav">
                    <li className="nav-item">
                    <h3 style={{lineHeight:'45px'}}>&nbsp;Taxonalytica</h3>
                    </li>
                    <li className="nav-item">
                    <h3>Department</h3>
                    </li>
                    <li className="nav-item">
                    <button><FiLogOut /></button>
                    </li>
          </ul> */}
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', alignItems: 'center' }}>
                    <li style={{ marginRight: '20px' }}>
                              <h5 style={{ lineHeight: '50px',position:'absolute',left:'5px' }}>Welcome <b>Anand</b></h5>
                              {/* Taxonalytica */}
                    </li>
                    <li style={{position:'absolute',right:'120px',top:'5px'}}>
                              <h5 style={{lineHeight: '35px',}}>{activePage}</h5> 
                    </li>
                    <li style={{position:'absolute',right:'10px',top:'5px'}}>
                              <button 
                              className="btn btn-primary"
                              style={{ width: "50px",background:'#09587c' }}
                              // variant="primary"
                              ><FiLogOut /></button>
                    </li>
          </ul>

      </div>
    </nav>
          )
}
export default Navbar