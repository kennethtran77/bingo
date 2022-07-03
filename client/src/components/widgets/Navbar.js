import React, { useState, useCallback, useLayoutEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import ExploreIcon from '@mui/icons-material/Explore';
import LogoutIcon from '@mui/icons-material/Logout';

import { logout } from '../../actions/auth';

import styles from './Navbar.module.css';
import LoadingSpinner from './LoadingSpinner';
import MenuButton from './MenuButton';
import Tooltip from './Tooltip';
import Button from './Button';

const Navbar = ({ userId }) => {
    // fetch user object from store
    const { users } = useSelector(state => state.usersSlice);
    const user = users.find(u => u._id === userId);

    const dispatch = useDispatch();

    const signout = useCallback(() => dispatch(logout()), [dispatch]);

    const [mobileNav, setMobileNav] = useState(false);

    // trigger mobile navigation on width breakpoint
    useLayoutEffect(() => {
        const query = window.matchMedia("(max-width: 728px");
        setMobileNav(query.matches);
        query.addEventListener('change', e => setMobileNav(e.matches));
    }, [])

    const getNavOptions = useCallback(() => {
        return (
            <div id={mobileNav ? styles["mobile-navbar-options"] : styles["wide-navbar-options"]}>
                <Button link="/" tooltip="Home" text={mobileNav && "Home"} Icon={<HomeIcon />} width={mobileNav ? '100%' : ''} />
                <Button link="/settings" tooltip="Settings" text={mobileNav && "Settings"} Icon={<SettingsIcon />} width={mobileNav ? '100%' : ''} />
                <Button link="/collections" tooltip="Collections" text={mobileNav && "Collections"} Icon={<BookmarksIcon />} width={mobileNav ? '100%' : ''} />
                <Button link="/browse" tooltip="Browse Concepts" text={mobileNav && "Browse Concepts"} Icon={<ExploreIcon />} width={mobileNav ? '100%' : ''} />
                { user ? (
                    <div className="center-flex" style={{ marginLeft: !mobileNav ? '15px' : '' }}>
                        <div className="h-margin"><strong>{user.username}</strong></div>
                        <Button onClick={signout} tooltip="Log Out" Icon={<LogoutIcon />} width={mobileNav ? '100%' : ''} />
                    </div>
                ) : <LoadingSpinner /> }
            </div>
        );
    }, [mobileNav, user]);

    return (
        <nav>
            <div id={styles["navbar-wrapper"]} className="space-between">
                <h1>bingo</h1>
                { mobileNav ?
                    <Tooltip
                        showOnClick={true}
                        direction={'below-left'}
                        content={getNavOptions()}
                    >
                        <MenuButton id={styles['navbar-menu']} tooltip="Open Menu" />
                    </Tooltip>
                :
                    getNavOptions()
                }
            </div>
        </nav>
    );
};

export default Navbar;