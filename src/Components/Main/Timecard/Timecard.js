import React, { Component } from 'react';
// import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';
import { Link } from 'react-router-dom';
import './timecard.css';


export default class Timecard extends Component {
 
    componentDidMount() {
        this.props.getThoseHours();
    }
    
    render() {
        const { loggedIn, firstName, lastName, hours, adminUser } = this.props;
        


        // const newDateFormat = toDateString(hours.timeIn);

        const timeMap = this.props.hours.map((day, i) => {
            let timeIn = new moment(day.timeIn);
            let timeOut = new moment(day.timeOut);
            // let total = moment.duration(timeOut.diff(timeIn), 'milliseconds').format('HH:mm:ss');
            let total = moment.duration(timeOut.diff(timeIn));
            // let days = total.days()
            let hh = total.hours();
            let mm = total.minutes();
            let ss = total.seconds();
            console.log(timeOut);
            return (
                <tr>
                    <td> 
                        {moment(timeIn).tz('America/Boise').format('MM-DD-YYYY')}
                    </td>
                    <td>
                        {moment(timeIn).tz('America/Boise').format('hh:mm A z')}
                    </td>
                    <td>
                        { day.timeOut ? moment(timeOut).tz('America/Boise').format('hh:mm A z') : '-' }
                    </td>
                    <td>
                        { day.timeOut ? `${hh}.${mm} hours` : '-' }
                    </td>
                    
                </tr>
            )
        })
        
        console.log(hours[0])

        return (
            <div className="timecard-body">
                <div className="header-container">
                    {!loggedIn ?
                        <div className="navbar-left">EMPLOYEE TIME</div>
                        :   
                        <div className="navbar-left">{firstName} {lastName}</div>
                    }
                    <div className="navbar-right">
                        <Link to='/'>
                            <button>HOME</button>
                        </Link>
                        {adminUser?
                        <Link to='/employees'>
                            <button>EMPLOYEES</button>
                        </Link>
                        : null  
                        }
                        { !loggedIn ?
                        <Link to='/about'>
                            <button>ABOUT</button>
                        </Link>
                        : 
                        <Link to='/timecard'>
                            <button>TIMECARD</button>
                        </Link>
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
                <div className="timecard-content">
                    <table>
                        <tbody>
                            <tr>
                                <th>DATE</th>
                                <th>TIME IN</th>
                                <th>TIME OUT</th>
                                <th>TOTAL</th>
                            </tr>
                            {timeMap}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    
}

