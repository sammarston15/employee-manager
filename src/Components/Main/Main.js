import React, { Component } from 'react';
// import axios from 'axios';
import { Link } from 'react-router-dom';
import './main.css';



export default class Main extends Component {

  adminUserStyle = () => {
    if (this.props.loggedIn === true && this.props.adminUser === true) {
      return (
        <div>
          <Link to='/employees'>
            <button>EMPLOYEES</button>
          </Link>
          <Link to='/timecard'>
            <button>TIMECARD</button>
          </Link>
        </div>
      )
    }
    if (this.props.loggedIn === true && this.props.adminUser === false) {
      return (
        <Link to='/timecard'>
          <button>TIMECARD</button>
        </Link>
      )
    }
  }

  // handleChange = (e) => this.setState({ [e.target.name]: e.target.value })


  render() {

    const { firstName, lastName, loggedIn, handleClockIn, handleClockOut, clockedIn, totalHours, adminUser } = this.props;
    console.log(this.props);
    // debugger
    const clockedOutStyle = {color: 'red'};
    const clockedInStyle = {color: 'green'};



    //Admin user style classnames
    const adminStyleHome = 'admin-style-home';
    const adminStyleNav = 'admin-style-nav';





    return (
      <div className="main">
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
            { !loggedIn ?
              <Link to='/about'>
                <button>ABOUT</button>
              </Link>
              : 
              this.adminUserStyle()
            }
            { !this.props.loggedIn? 
              <Link to='/login'>
                <button>LOGIN</button>
              </Link>
              :
              <Link to='/signout'>
                <button onClick={this.props.killSession}>LOGOUT</button>
              </Link>
            }
          </div>
        </div>
        <div className="body-container">
          { !loggedIn ?
            <div className="welcome-container">
              Welcome to Proline Time!
              <p className="introduce-container">Login or Sign Up to get started!</p>
              <p className="introduce-container1">Proline Time&copy; is a web application where employees can keep track of the hours they work.</p>
            </div>
            
            :

            <div className="total-hours">
                <div className="total-box">
                  <div>
                    TOTAL HOURS:
                  </div>
                  <div>
                    {totalHours.hh} hours {totalHours.mm} minutes
                  </div>
                </div>
              <div className="timeclock-container">
                    <button onClick={handleClockIn}>CLOCK IN</button>
                    <button onClick={handleClockOut}>CLOCK OUT</button>
                    { clockedIn === true ?
                      <div style={clockedInStyle}>CLOCKED IN</div>
                      :
                      <div style={clockedOutStyle}>CLOCKED OUT</div>
                    }
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}


