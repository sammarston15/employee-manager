import React, { Component } from 'react';
// import axios from 'axios';
import { Link } from 'react-router-dom';
import './login.css';


export default class Login extends Component {
 
    onKeyPress = (e) => {
        if (e.which === 13) {
            this.props.handleLogin();
        }
    }
    
    render() {
        const { username, password } = this.props;
        return (
            <div className="login-body">
                <div className="login-modal">
                    <div className="login-title">EMPLOYEE LOGIN</div>
    
                    <input type="text" placeholder="username" onChange={this.props.handleChange} name="username" value={username} />
                    <input type="password" placeholder="password" onChange={this.props.handleChange} onKeyPress={this.onKeyPress} name="password" value={password} />
                    
                    <div className="buttons">
                        <button className='login-button' onClick={this.props.handleLogin}>LOGIN</button>
                        <Link to='/signup'>
                            <button className='signup-button'>SIGN UP</button>
                        </Link>
                    </div>
                </div>
                
            </div>
        );
    }
    
}


