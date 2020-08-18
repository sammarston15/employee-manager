import React from 'react';
import './Employees.css';
import { Link } from 'react-router-dom';


const Employees = (props) => {

  const { firstName, lastName, loggedIn, handleClockIn, handleClockOut, clockedIn, totalHours, adminUser } = props;
  console.log('props', props)

  return (
    <div className='wrapper'>
      <div className="header-container">
        {!loggedIn ?
        <div className="navbar-left">PROLINE TIME&copy;</div>
        :
        <div className="navbar-left">{firstName} {lastName}</div>
        }

        <div className="navbar-right">
          <Link to='/'>
            <button>HOME</button>
          </Link>
          <Link to='/employees'>
            <button>EMPLOYEES</button>
          </Link>
          <Link to='/timecard'>
            <button>TIMECARD</button>
          </Link>
          { !props.loggedIn? 
            <Link to='/login'>
              <button>LOGIN</button>
            </Link>
            :
            <Link to='/signout'>
              <button onClick={props.killSession}>LOGOUT</button>
            </Link>
          }
        </div>
      </div>
      <div className='employee-body-container'>
        this is where the employee info needs to go
      </div>
    </div>
  )
}

export default Employees
