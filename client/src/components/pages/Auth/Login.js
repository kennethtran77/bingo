import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { login } from '../../../actions/auth.js';

import './Auth.css';
import LoadingSpinner from '../../widgets/LoadingSpinner.js';

const Login = () => {
    const [input, setInput] = useState({ email: '', password: '' })

    const { isLoading, message } = useSelector(state => state.authSlice);

    const dispatch = useDispatch();

    const handleChange = useCallback(e => setInput({ ...input, [e.target.name]: e.target.value }), [input]);

    const handleSubmit = useCallback(e => {
        e.preventDefault();
        dispatch(login(input));
    }, [input, dispatch]);

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
                        Password
                        <input
                            required
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={handleChange}
                        />
                    </label>
                    <input className="small-button" type="submit" value="Log In" />
                    <p>Don't have an account? <Link to="/signup" className="coloured-link">Sign Up</Link></p>
                    { isLoading && <LoadingSpinner /> }
                    { message.content && <p style={{color: message.colour}} id="message">{message.content}</p> }
                </form>
            </div>
        </>
    );
};

export default Login;