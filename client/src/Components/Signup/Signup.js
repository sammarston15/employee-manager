import React, { Component } from 'react';
// import axios from 'axios';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './signup.css';


export default class Signup extends Component {

    // state = {
    //     username: '',
    // }
    
    
    
    render() {
        const { firstName, lastName, username, password } = this.props;
        return (
            <div className="signup-body">
                <div className="signup-modal">
                    <div className="login-title">SIGNUP</div>
    
                    <input type="text" placeholder="FIRST NAME" onChange={this.props.handleChange} name="firstName" value={firstName} />
                    <input type="text" placeholder="LAST NAME" onChange={this.props.handleChange} name="lastName" value={lastName} />
                    <input type="text" placeholder="USERNAME" onChange={this.props.handleChange} name="username" value={username} />
                    <input type="password" placeholder="PASSWORD" onChange={this.props.handleChange} name="password" value={password} />
                    
                    <div className="buttons">
                        {/* <span>LOGIN</span> */}
                        <button className="sigup-button" onClick={this.props.handleSignup}>SIGN UP</button>
                    </div>
                </div>
                
            </div>
        );
    }
    
    
}


