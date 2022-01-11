import React, { useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Popup from 'reactjs-popup';

import './Navbar.css';

const Navbar = ({ decodedToken }) => {
    const { users } = useSelector(state => state.usersSlice);
    const user = users.find(u => u._id === decodedToken.id);

    const dispatch = useDispatch();
    const location = useLocation();

    const logout = useCallback(() => {
        dispatch({ type: 'auth/startLoading' });
        localStorage.removeItem('profile');
        dispatch({ type: 'auth/stopLoading' });
        dispatch({ type: 'practice/clear' });
        window.location.reload();
    }, [dispatch]);

    useEffect(() => {
        if (decodedToken.exp * 1000 < new Date().getTime()) {
            logout();
        }
    }, [location, logout, decodedToken]);

    return (
        <div id="navbar">
            <div id="navbar-wrapper" className="space-between">
                <h1>bingo</h1>
                <div id="navbar-options">
                    <Link className="nav-button" to="/">Home</Link>
                    <Link className="nav-button" to="/settings">Settings</Link>
                    <Link className="nav-button" to="/collections">Collections</Link>
                    <Link className="nav-button" to="/browse">Browse Concepts</Link>
                    <div className="center-flex">
                        <strong className="h-margin">{user && user.username}</strong>
                        <button className="nav-button h-margin" onClick={logout}>Log Out</button>
                    </div>
                </div>
                <Popup
                    trigger={<span className="more" id="navbar-menu"></span>}
                    closeOnDocumentClick
                    closeOnEscape
                    position="left top"
                >
                    <div id="mobile-navbar-options">
                        <Link className="nav-button" to="/">Home</Link>
                        <Link className="nav-button" to="/settings">Settings</Link>
                        <Link className="nav-button" to="/collections">Collections</Link>
                        <Link className="nav-button" to="/browse">Browse Concepts</Link>
                        <div className="container">
                            <div className="h-margin">Logged in as</div>
                            <div className="h-margin"><strong>{user && user.username}</strong></div>
                        </div>
                        <span className="nav-button" onClick={logout}>Log Out</span>
                    </div>
                </Popup>
            </div>
        </div>
    );
};

export default Navbar;