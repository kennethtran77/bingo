import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { signUp } from '../../../actions/auth.js';

import './Auth.css';

const Signup = () => {
    const [input, setInput] = useState({ email: '', username: '', password: '', confirmPassword: '' });

    const dispatch = useDispatch();
    const history = useHistory();

    const { isLoading, message } = useSelector(state => state.authSlice);

    const handleChange = e => setInput({ ...input, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(signUp(input, history));
    }

    return (
        <div id="auth">
            <form className="container" onSubmit={handleSubmit}>
                <label>
                    Email
                    <input
                        required
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Username
                    <input
                        required
                        type="text"
                        name="username"
                        autoComplete="off"
                        value={input.username}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Password
                    <input
                        required
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Confirm Password
                    <input
                        required
                        type="password"
                        name="confirmPassword"
                        value={input.confirmPassword}
                        onChange={handleChange}
                    />
                </label>
                <input className="small-button" type="submit" value="Sign Up" />
                <p>Already have an account? <Link to="/login">Log In</Link></p>
                { isLoading && <p>Loading...</p> }
                { message.content && <p style={{color: message.colour}}>{message.content}</p> }
            </form>
        </div>
    );
};

export default Signup;