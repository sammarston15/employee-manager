import React, { Component } from "react";
import axios from "axios";
import { Switch, Route, withRouter } from "react-router-dom";
import "./reset.css";
import "./App.css";
import Main from "./Components/Main/Main";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Timecard from './Components/Main/Timecard/Timecard';

class App extends Component {
  constructor() {
    super();

    this.state = {
      timestamps: [],
      employeeId: '',
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      loggedIn: false,
      hours: '',
      clockedIn: false,
      clockedOut: true,
      timeIn: '',
      timeOut: ''
    };
  }

  componentDidMount() {
    axios
      .get("/user")
      .then(response => {
        this.setState({
          employeeId: response.data.user_id,
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          username: response.data.username,
          loggedIn: true
        });
      })
      .catch((err) => console.error(err));
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
      // console.log(user);
      if (!this.state.loggedIn) {
        this.setState({
          loggedIn: !this.state.loggedIn,
          firstName: user.first_name,
          lastName: user.last_name,
          employeeId: user.user_id
        });
      }

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
          firstName: '',
          lastName: '',
          username: '',
          password: ''
        });

      const { data: signoutMessage } = await axios.get("/signout");

      this.props.history.push("/");
      alert("Successfully logged out!");
    } catch (error) {
      console.error(error);
    }
  };

  handleGetHours() {
    axios.get('/hours')
      .then(response => {
        // console.log(response)
        this.setState({
          hours: '',
          timeIn: response.data.time_in,
          timeOut: response.data.time_out
        })
        this.state.timestamps.push(response.data);
      })
      .catch(() => console.error());

    
  }

  render() {
    // console.log(this.state);
    // console.log(this.props);
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
            />
          </Route>
          <Route path="/timecard" component={Timecard}>
            <Timecard loggedIn={this.state.loggedIn}
                      firstName={this.state.firstName}
                      lastName={this.state.lastName}
                      killSession={this.killSession}
                      employeeId={this.state.employeeId}
                      timeIn={this.state.timeIn}
                      timeOut={this.state.timeOut}
                      clockedIn={this.state.clockedIn}
                      clockedOut={this.state.clockedOut}
                      getHours={this.state.handleGetHours}
                      time={this.state.timestamps}
              />
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
