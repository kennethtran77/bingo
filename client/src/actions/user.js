import * as api from '../api/index.js';

const setTimedMessage = (message, colour, interval) => (dispatch, getState) => {
    dispatch({ type: 'settings/setMessage', payload: { content: message, colour }});

    let timer = getState().settingsSlice.messageTimer;
    const newTimer = setTimeout(() => {
        dispatch({ type: 'settings/setMessage', payload: '' });
        dispatch({ type: 'settings/setMessageTimer', payload: null });
    }, interval);

    // reset the timer if it already exists
    if (timer)
        clearTimeout(timer);

    dispatch({ type: 'settings/setMessageTimer', payload: newTimer });
}

export const fetchUsernames = () => async (dispatch) => {
    try {
        dispatch({ type: 'users/startLoading' });
        const { data } = await api.fetchUsernames();
        dispatch({ type: 'users/fetchAll', payload: data });
        dispatch({ type: 'users/stopLoading' });
    } catch (error) {
        console.log(error);
        dispatch({ type: 'users/stopLoading' });
    }
}

export const fetchSettings = () => async (dispatch) => {
    try {
        dispatch({ type: 'settings/startLoading' });
        const { data } = await api.fetchSettings();
        dispatch({ type: 'settings/update', payload: data });
        dispatch({ type: 'settings/stopLoading' });
    } catch (error) {
        console.log(error);
        dispatch({ type: 'settings/stopLoading' });
    }
}

export const updateUsername = (newUsername, userId) => async (dispatch) => {
    try {
        dispatch({ type: 'settings/startLoading' });
        const { data } = await api.updateUsername(newUsername);
        dispatch({
            type: 'users/update',
            payload: { _id: userId, username: newUsername }
        });
        dispatch(setTimedMessage(data.message, 'green', 2500));
        dispatch({ type: 'settings/stopLoading' });
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'settings/stopLoading' });
    }
}

export const updateSettings = (newSettings) => async (dispatch) => {
    try {
        dispatch({ type: 'settings/startLoading' });
        const { data } = await api.updateSettings(newSettings);
        dispatch({
            type: 'settings/update',
            payload: newSettings
        })
        dispatch(setTimedMessage(data.message, 'green', 2500));
        dispatch({ type: 'settings/stopLoading' });
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'settings/stopLoading' });
    }
}

export const updatePassword = (password, newPassword, confirmNewPassword) => async (dispatch) => {
    try {
        dispatch({ type: 'settings/startLoading' });
        const { data } = await api.updatePassword(password, newPassword, confirmNewPassword);
        dispatch(setTimedMessage(data.message, 'green', 2500));
        dispatch({ type: 'settings/stopLoading' });
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'settings/stopLoading' });
    }
}