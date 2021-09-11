import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Popup from 'reactjs-popup';

import './Navbar.css';

const Navbar = ({ decodedToken }) => {
    const [username, setUsername] = useState('');

    const user = useSelector(state => state.settingsSlice.username);

    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            setUsername(user);
        }
    }, [user]);

    const logout = useCallback(() => {
        dispatch({ type: 'auth/startLoading' });
        localStorage.removeItem('profile');
        dispatch({ type: 'auth/stopLoading' });
        dispatch({ type: 'practice/clear' });
        dispatch({ type: 'settings/setUsername', payload: '' });
        window.location.reload();
    }, [dispatch]);

    useEffect(() => {
        if (decodedToken.exp * 1000 < new Date().getTime()) {
            logout();
        }
    }, [location, logout, decodedToken]);

    return (
        <div className="container space-between" id="navbar">
            <h1>bingo</h1>
            <div id="navbar-options">
                <Link className="nav-button" to="/">Home</Link>
                <Link className="nav-button" to="/settings">Settings</Link>
                <Link className="nav-button" to="/collections">Collections</Link>
                <Link className="nav-button" to="/browse">Browse Concepts</Link>
                <div className="center-flex">
                    <strong className="h-margin">{username}</strong>
                    <button className="nav-button h-margin" onClick={logout}>Log Out</button>
                </div>
            </div>
            <Popup
                trigger={<span className="more" id="navbar-menu"></span>}
                closeOnDocumentClick
            >
                <div id="mobile-navbar-options">
                    <Link className="nav-button" to="/">Home</Link>
                    <Link className="nav-button" to="/settings">Settings</Link>
                    <Link className="nav-button" to="/collections">Collections</Link>
                    <Link className="nav-button" to="/browse">Browse Concepts</Link>
                    <div className="container">
                        <div className="h-margin">Logged in as</div>
                        <div className="h-margin"><strong>{username}</strong></div>
                    </div>
                    <span className="nav-button" onClick={logout}>Log Out</span>
                </div>
            </Popup>
        </div>
    );
};

export default Navbar;