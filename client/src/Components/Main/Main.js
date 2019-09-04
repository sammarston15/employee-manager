import React, { Component } from 'react';
// import axios from 'axios';
import { Link } from 'react-router-dom';
import './main.css';



export default class Main extends Component {

  adminUserStyle = () => {
    if (this.props.loggedIn === true && this.props.adminUser === true) {
      return (
        <Link to='/employees'>
          <button>EMPLOYEES</button>
        </Link>
      )
    }
    if (this.props.loggedIn === true) {
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
              <div className="total">
                <div className="total-box">
                  <div className="total-title">
                    TOTAL HOURS:
                  </div>
                  <div className="hours-display">
                    {totalHours.hh} hours {totalHours.mm} minutes
                  </div>
                </div>
              </div>
              <div className="timeclock-container">
                <div className="time-buttons-box">
                  <div className="time-button-container">
                    <button className="time-button" onClick={handleClockIn}>CLOCK IN</button>
                    <button className="time-button" onClick={handleClockOut}>CLOCK OUT</button>
                  </div>
                  <div className="status-box">
                    <div className="status-container">
                      { clockedIn === true ?
                        <div style={clockedInStyle}>CLOCKED IN</div>
                        :
                        <div style={clockedOutStyle}>CLOCKED OUT</div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}


