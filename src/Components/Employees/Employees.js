import React, {useEffect, useState} from 'react';
import '../../reset.css';
import './Employees.css';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Employees = (props) => {

  const { firstName, lastName, loggedIn, handleClockIn, handleClockOut, clockedIn, totalHours, adminUser, employeeList } = props;

  // console.log('employeeList', employeeList)

  const employees = employeeList.map((employee, i) => {
    return(
      <tr className='display-employees' key={i}>
          <td><input type="checkbox"/></td>
          <td>{employee.user_id}</td>
          <td>{employee.first_name}</td>
          <td>{employee.last_name}</td>
          <td>{employee.username}</td>
      </tr>
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
        <div>Employees</div>
        <button>EDIT</button>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Employee ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {employees}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Employees
