import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { login } from '../../../actions/auth.js';

import style from './Auth.module.css';
import LoadingSpinner from '../../widgets/LoadingSpinner.js';
import Button from '../../widgets/Button.js';

const Login = () => {
    const [input, setInput] = useState({ email: '', password: '' })

    const { isLoading, message } = useSelector(state => state.authSlice);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'auth/setMessage', payload: '' });
        dispatch({ type: 'auth/setMessageTimer', payload: null });
    }, []);

    const handleChange = useCallback(e => setInput({ ...input, [e.target.name]: e.target.value }), [input]);

    const handleSubmit = useCallback(() => {
        dispatch(login(input));
    }, [input, dispatch]);

    const handleKeyDown = useCallback(e => {
        if (e.key === 'Enter')
            handleSubmit(e);
    });

    return (
        <>
            <h1 id={style.title}>bingo</h1>
            <div id={style.auth}>
                <form className="container" onSubmit={handleSubmit}>
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
                    <Button onClick={handleSubmit} text="Log In" background />
                    <p>Don't have an account? <Link to="/signup" className="coloured-link">Sign Up</Link></p>
                    { isLoading && <LoadingSpinner /> }
                    { message.content && <p style={{color: message.colour}} id="message">{message.content}</p> }
                </form>
            </div>
        </>
    );
};

export default Login;