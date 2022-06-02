import React, { useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import './Navbar.css';
import LoadingSpinner from './LoadingSpinner';
import MenuButton from './MenuButton';
import Tooltip from './Tooltip';

const Navbar = ({ decodedToken }) => {
    // fetch user object from store
    const { users } = useSelector(state => state.usersSlice);
    const user = users.find(u => u._id === decodedToken.id);

    const dispatch = useDispatch();
    const location = useLocation();

    const logout = useCallback(() => {
        dispatch({ type: 'auth/startLoading' });
        localStorage.removeItem('profile');
        dispatch({ type: 'auth/stopLoading' });
        dispatch({ type: 'practice/clear' }); // clear practice sessions
        window.location.reload();
    }, [dispatch]);

    // automatically logout once token expires
    useEffect(() => {
        if (decodedToken.exp * 1000 < new Date().getTime()) {
            logout();
        }
    }, [location, logout, decodedToken]);

    return (
        <nav>
            <div id="navbar-wrapper" className="space-between">
                <h1>bingo</h1>
                <div id="navbar-options">
                    <Link className="nav-button link" to="/">Home</Link>
                    <Link className="nav-button link" to="/settings">Settings</Link>
                    <Link className="nav-button link" to="/collections">Collections</Link>
                    <Link className="nav-button link" to="/browse">Browse Concepts</Link>
                    <div className="center-flex">
                        <strong className="h-margin">{user ? user.username : <LoadingSpinner />}</strong>
                        <button className="nav-button h-margin" onClick={logout}>Log Out</button>
                    </div>
                </div>
                <Tooltip
                    showOnClick={true}
                    direction={'below-left'}
                    content={
                        <div id="mobile-navbar-options">
                            <Link className="nav-button link" to="/">Home</Link>
                            <Link className="nav-button link" to="/settings">Settings</Link>
                            <Link className="nav-button link" to="/collections">Collections</Link>
                            <Link className="nav-button link" to="/browse">Browse Concepts</Link>
                            <div className="container">
                                { user ? (
                                    <>
                                        <div className="h-margin">Logged in as</div>
                                        <div className="h-margin"><strong>{user.username}</strong></div>
                                    </>
                                ) : <LoadingSpinner /> }
                            </div>
                            <span className="nav-button" onClick={logout}>Log Out</span>
                        </div>
                    }
                >
                    <MenuButton id='navbar-menu' tooltip="Open Menu" />
                </Tooltip>
            </div>
        </nav>
    );
};

export default Navbar;