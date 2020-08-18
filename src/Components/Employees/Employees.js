import React, {useEffect, useState} from 'react';
import './Employees.css';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Employees = (props) => {

  const { firstName, lastName, loggedIn, handleClockIn, handleClockOut, clockedIn, totalHours, adminUser, employeeList } = props;

  console.log('employeeList', employeeList)

  const employees = employeeList.map((employee, i) => {
    return(
      <div className='display-employees' key={i}>
          <input type="checkbox" name="edit" id=""/>
          <div>{employee.user_id}</div>
          <div>{employee.first_name}</div>
          <div>{employee.last_name}</div>
          <div>{employee.username}</div>
      </div>
    )
  })
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
        <div className="table-header">
          <input type="checkbox" name="edit"/>
          <div>Employee ID</div>
          <div>First Name</div>
          <div>Last Name</div>
          <div>Username</div>
        </div>
        {employees}
      </div>
    </div>
  )
}

export default Employees
