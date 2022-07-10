import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { fetchSignupKeyEnabled, signUp } from '../../../actions/auth.js';

import styles from './Auth.module.css';
import LoadingSpinner from '../../widgets/LoadingSpinner.js';
import Button from '../../widgets/Button.js';

import { validateEmail, validateUsername, validatePassword, validateConfirmPassword } from '../../../util';
import WarningInput from '../../widgets/WarningInput.js';
import Input from '../../widgets/Input.js';

const Signup = () => {
    const [input, setInput] = useState({ email: '', username: '', password: '', confirmPassword: '', key: '' });

    const { isLoading, message, signupKeyEnabled } = useSelector(state => state.authSlice);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'auth/setMessage', payload: '' });
        dispatch({ type: 'auth/setMessageTimer', payload: null });
    }, []);

    useEffect(() => {
        if (!signupKeyEnabled) {
            dispatch(fetchSignupKeyEnabled());
        }
    }, [signupKeyEnabled]);

    const handleChange = e => setInput({ ...input, [e.target.name]: e.target.value });

    const handleSubmit = () => dispatch(signUp(input));

    const handleKeyDown = e => {
        if (e.key === 'Enter') handleSubmit();
    };

    return (
        <>
            <h1 id={styles.title}>bingo</h1>
            <div id={styles.auth}>
                <form className="container">
                    <WarningInput
                        className={styles.input}
                        label="Email"
                        validate={validateEmail}
                        autoComplete="new-password"
                        required
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <WarningInput
                        className={styles.input}
                        label="Username"
                        validate={validateUsername}
                        autoComplete="new-password"
                        required
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <WarningInput
                        className={styles.input}
                        label="Password"
                        validate={validatePassword}
                        autoComplete="new-password"
                        required
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                    />
                    <WarningInput
                        className={styles.input}
                        label="Confirm Password"
                        validate={() => validateConfirmPassword(input.password, input.confirmPassword)}
                        autoComplete="new-password"
                        required
                        type="password"
                        name="confirmPassword"
                        value={input.confirmPassword}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        subscriptions={[input.password]}
                    />
                    { signupKeyEnabled &&
                        <label>
                            Sign-Up Key
                            <Input
                                className={styles.input}
                                required
                                autoComplete="new-password"
                                type="password"
                                name="key"
                                value={input.key}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </label>
                    }
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