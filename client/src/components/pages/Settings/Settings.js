import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSettings, updateUsername, updatePassword } from '../../../actions/user';
import { validatePassword, validateUsername, validateConfirmPassword } from '../../../util';
import Button from '../../widgets/Button';
import LoadingSpinner from '../../widgets/LoadingSpinner';
import WarningInput from '../../widgets/WarningInput';

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

    const handleSaveSettings = () => {
        dispatch(updateSettings({ questionsPerSession: input.questionsPerSession }));
    }

    const handleSaveUsername = () => {
        dispatch(updateUsername(input.username, userId));
        setInput(input => ({ ...input, username: '' }));
    }

    const handleSavePassword = () => {
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
                        <Button onClick={handleSaveSettings} text="Save" background />
                    </div>
                    <div>
                        <WarningInput
                            label="Change Username"
                            validate={validateUsername}
                            type="text"
                            name="username"
                            autoComplete="new-password"
                            value={input.username}
                            onChange={handleChange}
                            onKeyDown={e => {
                                if (e.key === 'Enter')
                                    handleSaveUsername();
                            }}
                        />
                        <Button onClick={handleSaveUsername} text="Save" background />
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
                        <WarningInput
                            label="New Password"
                            validate={validatePassword}
                            type="password"
                            name="newPassword"
                            autoComplete="new-password"
                            value={input.newPassword}
                            onChange={handleChange}
                            onKeyDown={e => {
                                if (e.key === 'Enter')
                                    handleSavePassword();
                            }}
                        />
                        <WarningInput
                            label="Confirm New Password"
                            validate={() => validateConfirmPassword(input.newPassword, input.confirmNewPassword)}
                            type="password"
                            name="confirmNewPassword"
                            autoComplete="new-password"
                            value={input.confirmNewPassword}
                            onChange={handleChange}
                            onKeyDown={e => {
                                if (e.key === 'Enter')
                                    handleSavePassword();
                            }}
                            subscriptions={[input.newPassword]}
                        />
                        <Button onClick={handleSavePassword} text="Save" background />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Settings;