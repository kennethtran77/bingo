import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { signUp } from '../../../actions/auth.js';

import './Auth.css';
import LoadingSpinner from '../../widgets/LoadingSpinner.js';

const Signup = () => {
    const [input, setInput] = useState({ email: '', username: '', password: '', confirmPassword: '' });

    const dispatch = useDispatch();

    const { isLoading, message } = useSelector(state => state.authSlice);

    const handleChange = e => setInput({ ...input, [e.target.name]: e.target.value });

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(signUp(input));
    }

    return (
        <>
            <h1 id="title">bingo</h1>
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
                    <p>Already have an account? <Link to="/login" className="coloured-link">Log In</Link></p>
                    { isLoading && <LoadingSpinner /> }
                    { message.content && <span style={{color: message.colour}} id="message">{message.content}</span> }
                </form>
            </div>
        </>
    );
};

export default Signup;