import React, { Component } from "react";
import axios from "axios";
import moment from 'moment';
import 'moment-timezone';
import { Switch, Route, withRouter } from "react-router-dom";
import "./reset.css";
import "./App.css";
import Main from "./Components/Main/Main";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Timecard from './Components/Main/Timecard/Timecard';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeId: '',
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      loggedIn: false,
      hours: [
        { date: '', timeIn: '', timeOut: '' }
      ],
      clockedIn: false,
      clockedOut: true,
      totalHours: '',
      adminUser: false
    };
  }

  componentDidMount() {
      axios.get('/user').then(response => {
        const user = response.data;
        if(user) {
          this.setState({
            employeeId: user.user_id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            loggedIn: true,
          })
        }
        if(user.admin_user=== true) this.setState({ adminUser: true})
      if (this.state.loggedIn === true) {
        this.getThoseHours();
        this.displayTotalHours();
      };
  
      axios.get('/time-status').then(response => {
        console.log('time status`')
        const status = response.data;
        if(status) {
          this.setState({
            clockedIn: true,
            clockedOut: false
          })
        }
      }).catch(error => {
      console.log('something brokeded')
      console.log(error)
      })
    }).catch(error => {
            console.log('something brokeded')
            console.log(error)
    })


    // let promises = [];
    //   promises.push(axios.get('/user'))
    //   promises.push(axios.get('/hours'))
    //   promises.push(axios.get('/time-status'))

    // // Promise.all([
    // //   axios.get('/user'),
    // //   axios.get('/hours'),
    // //   axios.get('/time-status')
    // // ])
   
    // .then(response => {
    //   console.log('we in it')
    //   const user = response[0].data;
    //   const hours = response[1].data.map(e => ({ timeIn: e.time_in, timeOut: e.time_out }));
    //   const status = response[2].data;
    //   console.log(response.data)

    //   this.setState({
    //     employeeId: user.user_id,
    //     firstName: user.first_name,
    //     lastName: user.last_name,
    //     username: user.username,
    //     loggedIn: true,
    //     hours: hours
    //   })

    //   if(status) {
    //     this.setState({
    //       clockedIn: true,
    //       clockedOut: false
    //     })
    //   }
    //   debugger
    // }).catch(error => {
    //   console.log('something brokeded')
    //   console.log(error)
    // })
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  handleSignup = async () => {
    try {
      const body = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        username: this.state.username,
        password: this.state.password
      };

      const { data: signupMessage } = await axios.post("/signup", body);

      this.props.history.push("/login");
      alert("Successfully signed up! Please login.");
    } catch (error) {
      console.error(error);
    }
  };

  handleLogin = async () => {
    try {
      const { firstName, lastName, username, password } = this.state;
      const body = {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password
      };

      const loginResponse = await axios.post("/login", body);

      const { user, message } = loginResponse.data;
      console.log(user);
      if (!this.state.loggedIn) {
        this.getThoseHours();
        this.setState({
          loggedIn: !this.state.loggedIn,
          firstName: user.first_name,
          lastName: user.last_name,
          employeeId: user.user_id
        });
        if(user.admin_user === true) {
          this.setState({ adminUser: true });
        }
        await axios.get('/time-status').then(response => {
          console.log('time status`')
          const status = response.data;
          if(status) {
            this.setState({
              clockedIn: true,
              clockedOut: false
            })
          }
        }).catch(error => {
        console.log('something brokeded')
        console.log(error)
        })
      }
      
      this.displayTotalHours();
      this.props.history.push("/");
      alert(message);
    } catch (error) {
      // console.log(error.response.data);
      alert(error.response.data);
    }
  };
  killSession = async () => {
    try {
      if (this.state.loggedIn)
        this.setState({ 
          loggedIn: !this.state.loggedIn,
          employeeId: '',
          firstName: "",
          lastName: "",
          username: "",
          password: "",
          hours: ""
        });

      const { data: signoutMessage } = await axios.get("/signout");

      this.props.history.push("/");
      alert("Successfully logged out!");
    } catch (error) {
      console.error(error);
    }
  };

  

  handleClockIn = () => {
    let userZone = moment.tz.guess(true);
    console.log('sdfghj')
    const { clockedIn, clockedOut, firstName, lastName, employeeId } = this.state;
    if (clockedIn === false && clockedOut === true) {
      const body = { 
        firstName,
        lastName,
        employeeId,
        clockedInAt: moment().tz("America/Boise").format('LLL') //8-24-2019 
      }
      axios.post('/clock-in', body)
      .then(() => {
       this.getThoseHours();
       this.setState({
         clockedIn: true,
         clockedOut: false
       })
      })
      
      
    }
  }

  handleClockOut = () => {
    let userZone = moment.tz.guess(true);
    console.log('hit clock out function');
    const { clockedIn, clockedOut, firstName, lastName, employeeId } = this.state;

    if (clockedIn === true && clockedOut === false) {
      const body = {
        firstName,
        lastName,
        employeeId,
        clockedOutAt: moment().tz().format('LLL')
      }

      axios.put('/clock-out', body)
      .then(() => {
        this.getThoseHours();
        this.displayTotalHours();
        this.setState({
          clockedIn: false,
          clockedOut: true
        })
      })
    }
  };

  getThoseHours = () => {
    axios.get('/hours').then(response => {
      const hours = response.data.map(e => ({ timeIn: e.time_in, timeOut: e.time_out }));
      this.setState({
        hours: hours
      })
    }).catch(error => {
    console.log('something brokeded')
    console.log(error)
    });
  }

  displayTotalHours = () => {
    console.log('total hours please?')
    const body = {
      user_id: this.state.employeeId
    }
    axios.get('total-hours', body).then((response) => {
      this.setState({totalHours: response.data});
    }).catch(error => console.log(error))
  }




  render() {
    // font used -- google's 'Karla' //


    console.log(this.state); 
    console.log(this.props);
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Main}>
            <Main loggedIn={this.state.loggedIn}
                  firstName={this.state.firstName}
                  lastName={this.state.lastName}
                  killSession={this.killSession}
                  employeeId={this.state.employeeId}
                  clockedIn={this.state.clockedIn}
                  clockedOut={this.state.clockedOut}
                  handleClockIn={this.handleClockIn}
                  handleClockOut={this.handleClockOut}
                  totalHours={this.state.totalHours}
                  adminUser={this.state.adminUser}
            />
          </Route>
          <Route path="/timecard" render={(props) => 
            <Timecard loggedIn={this.state.loggedIn}
                      firstName={this.state.firstName}
                      lastName={this.state.lastName}
                      killSession={this.killSession}
                      employeeId={this.state.employeeId}
                      timeIn={this.state.timeIn}
                      timeOut={this.state.timeOut}
                      clockedIn={this.state.clockedIn}
                      clockedOut={this.state.clockedOut}
                      hours={this.state.hours}
                      getThoseHours={this.getThoseHours}
              />}>
            
          </Route>
          <Route path="/login" component={Login}>
            <Login handleChange={this.handleChange}
                   handleLogin={this.handleLogin}
            />
          </Route>
          <Route path="/signup" component={Signup}>
            <Signup handleChange={this.handleChange}
                    handleSignup={this.handleSignup}
            />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);
