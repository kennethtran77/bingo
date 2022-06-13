import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../../actions/auth';

import styles from './Navbar.module.css';
import LoadingSpinner from './LoadingSpinner';
import MenuButton from './MenuButton';
import Tooltip from './Tooltip';

const Navbar = ({ decodedToken }) => {
    // fetch user object from store
    const { users } = useSelector(state => state.usersSlice);
    const user = users.find(u => u._id === decodedToken.id);

    const dispatch = useDispatch();

    const signout = useCallback(() => {
        dispatch(logout());
        dispatch({ type: 'practice/clear' }); // clear practice sessions
        window.location.reload();
    }, [dispatch]);

    return (
        <nav>
            <div id={styles["navbar-wrapper"]} className="space-between">
                <h1>bingo</h1>
                <div id={styles["navbar-options"]}>
                    <Link className={styles["nav-button"]} to="/">Home</Link>
                    <Link className={styles["nav-button"]} to="/settings">Settings</Link>
                    <Link className={styles["nav-button"]} to="/collections">Collections</Link>
                    <Link className={styles["nav-button"]} to="/browse">Browse Concepts</Link>
                    <div className="center-flex">
                        <strong className="h-margin">{user ? user.username : <LoadingSpinner />}</strong>
                        <button className={`${styles['nav-button']} h-margin`} onClick={signout}>Log Out</button>
                    </div>
                </div>
                <Tooltip
                    showOnClick={true}
                    direction={'below-left'}
                    content={
                        <div id={styles["mobile-navbar-options"]}>
                            <Link className={styles["nav-button"]} to="/">Home</Link>
                            <Link className={styles["nav-button"]} to="/settings">Settings</Link>
                            <Link className={styles["nav-button"]} to="/collections">Collections</Link>
                            <Link className={styles["nav-button"]} to="/browse">Browse Concepts</Link>
                            <div className="container" tabIndex={0}>
                                { user ? (
                                    <>
                                        <div className="h-margin">Logged in as</div>
                                        <div className="h-margin"><strong>{user.username}</strong></div>
                                    </>
                                ) : <LoadingSpinner /> }
                            </div>
                            <button className={styles["nav-button"]} onClick={signout} tabIndex={0}>Log Out</button>
                        </div>
                    }
                >
                    <MenuButton id={styles['navbar-menu']} tooltip="Open Menu" />
                </Tooltip>
            </div>
        </nav>
    );
};

export default Navbar;