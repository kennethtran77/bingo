import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings, updateUsername } from '../../../actions/user';

import './Settings.css';

const Settings = () => {
    const { settings, isLoading, message } = useSelector(state => state.settingsSlice);

    const [input, setInput] = useState({ questionsPerSession: settings.questionsPerSession, username: '', currentPassword: '', newPassword: '', confirmNewPassword: '' });

    const dispatch = useDispatch();

    useEffect(() => {
        if (settings) {
            setInput({ ...input, questionsPerSession: settings.questionsPerSession });
        }
    }, [settings]);

    const handleSaveSettings = e => {
        e.preventDefault();
        dispatch(updateSettings({ questionsPerSession: input.questionsPerSession }));
    }

    const handleSaveUsername = e => {
        e.preventDefault();
        dispatch(updateUsername(input.username));
        setInput({ ...input, username: '' });
    }

    const handleChange = e => setInput({ ...input, [e.target.name]: e.target.value });

    return (
        <div id="settings" className="container">
            <h2>Settings</h2>
            { isLoading && <p>Loading...</p> }
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
                        autoComplete="off"
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
                        autoComplete="off"
                        value={input.currentPassword}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    New Password
                    <input
                        type="password"
                        name="newPassword"
                        autoComplete="off"
                        value={input.newPassword}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Confirm New Password
                    <input
                        type="password"
                        name="confirmNewPassword"
                        autoComplete="off"
                        value={input.confirmNewPassword}
                        onChange={handleChange}
                    />
                </label>
                <button className="small-button">Save</button>
            </div>
        </div>
    );
}

export default Settings;