import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings, updateUsername, updatePassword } from '../../../actions/user';
import LoadingSpinner from '../../widgets/LoadingSpinner';

import './Settings.css';

const Settings = ({ userId }) => {
    const { settings, isLoading, message } = useSelector(state => state.settingsSlice);

    const [input, setInput] = useState({ questionsPerSession: settings.questionsPerSession, username: '', currentPassword: '', newPassword: '', confirmNewPassword: '' });

    const dispatch = useDispatch();

    useEffect(() => {
        if (settings) {
            setInput(input => ({ ...input, questionsPerSession: settings.questionsPerSession }));
        }
    }, [settings]);

    const handleSaveSettings = e => {
        e.preventDefault();
        dispatch(updateSettings({ questionsPerSession: input.questionsPerSession }));
    }

    const handleSaveUsername = e => {
        e.preventDefault();
        dispatch(updateUsername(input.username, userId));
        setInput(input => ({ ...input, username: '' }));
    }

    const handleSavePassword = e => {
        e.preventDefault();
        dispatch(updatePassword(input.currentPassword, input.newPassword, input.confirmNewPassword));
        setInput(input => ({ ...input, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
    }

    const handleChange = e => setInput(input => ({ ...input, [e.target.name]: e.target.value }));

    return (
        <>
            <h2 style={{textAlign: 'center'}}>Settings</h2>
            <div id="settings" className="container">
                <div id="content">
                    { isLoading && <LoadingSpinner /> }
                    { message.content && <p style={{color: message.colour}}>{message.content}</p> }
                    <div>
                        <label>
                            Questions Per Practice Session
                            <input
                                type="number"
                                name="questionsPerSession"
                                min="1" max="10"
                                value={input.questionsPerSession}
                                onChange={handleChange}
                            />
                        </label>
                        <button className="small-button" onClick={handleSaveSettings}>Save</button>
                    </div>
                    <div>
                        <h3>Change Username</h3>
                        <label>
                            Username
                            <input
                                type="text"
                                name="username"
                                autoComplete="new-password"
                                value={input.username}
                                onChange={handleChange}
                            />
                        </label>
                        <button className="small-button" onClick={handleSaveUsername}>Save</button>
                    </div>
                    <div>
                        <h3>Change Password</h3>
                        <label>
                            Current Password
                            <input
                                type="password"
                                name="currentPassword"
                                autoComplete="new-password"
                                value={input.currentPassword}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            New Password
                            <input
                                type="password"
                                name="newPassword"
                                autoComplete="new-password"
                                value={input.newPassword}
                                onChange={handleChange}
                            />
                        </label>
                        <label>
                            Confirm New Password
                            <input
                                type="password"
                                name="confirmNewPassword"
                                autoComplete="new-password"
                                value={input.confirmNewPassword}
                                onChange={handleChange}
                            />
                        </label>
                        <button className="small-button" onClick={handleSavePassword}>Save</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Settings;