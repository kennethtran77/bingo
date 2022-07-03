import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { signUp } from '../../../actions/auth.js';

import './Auth.css';
import LoadingSpinner from '../../widgets/LoadingSpinner.js';
import Button from '../../widgets/Button.js';

const Signup = () => {
    const [input, setInput] = useState({ email: '', username: '', password: '', confirmPassword: '' });

    const dispatch = useDispatch();

    const { isLoading, message } = useSelector(state => state.authSlice);

    const handleChange = e => setInput({ ...input, [e.target.name]: e.target.value });

    const handleSubmit = () => dispatch(signUp(input));

    const handleKeyDown = e => {
        if (e.key === 'Enter')
            handleSubmit()
    }

    return (
        <>
            <h1 id="title">bingo</h1>
            <div id="auth">
                <form className="container">
                    <label>
                        Email
                        <input
                            required
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
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
                            onKeyDown={handleKeyDown}
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
                            onKeyDown={handleKeyDown}
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
                            onKeyDown={handleKeyDown}
                        />
                    </label>
                    <Button text="Sign Up" onClick={handleSubmit} background />
                    <p>Already have an account? <Link to="/login" className="coloured-link">Log In</Link></p>
                    { isLoading && <LoadingSpinner /> }
                    { message.content && <span style={{color: message.colour}} id="message">{message.content}</span> }
                </form>
            </div>
        </>
    );
};

export default Signup;