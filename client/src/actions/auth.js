import decode from 'jwt-decode';

import * as api from '../api/index.js';
import { fetchPracticeSessions } from './practice.js';

const setTimedMessage = (message, colour, interval) => (dispatch, getState) => {
    dispatch({ type: 'auth/setMessage', payload: { content: message, colour }});

    let timer = getState().authSlice.messageTimer;

    // reset the timer if it already exists
    if (timer) {
        clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
        dispatch({ type: 'auth/setMessage', payload: '' });
        dispatch({ type: 'auth/setMessageTimer', payload: null });
    }, interval);

    dispatch({ type: 'auth/setMessageTimer', payload: newTimer });
}

export const login = (loginInput) => async (dispatch) => {
    try {
        // login
        dispatch({ type: 'auth/startLoading' });
        const { data } = await api.login(loginInput);

        // load practice sessions
        if (data && data.token) {
            localStorage.setItem('profile', JSON.stringify(data));
            window.dispatchEvent(new Event('storage')); // force storage event to occur
            dispatch(fetchPracticeSessions());
        }

        dispatch({ type: 'auth/stopLoading' });
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'auth/stopLoading' });
    }
};

export const signUp = (signUpInput, navigate) => async (dispatch) => {
    try {
        // signup
        dispatch({ type: 'auth/startLoading' });
        // data is an object with key `token`
        const { data } = await api.signUp(signUpInput);

        // userId is the id of the newly created user account
        const userId = decode(data.token).id;
        // update users slice
        dispatch({
            type: 'users/create',
            payload: { _id: userId, username: signUpInput.username }
        });

        localStorage.setItem('profile', JSON.stringify(data));
        dispatch({ type: 'auth/stopLoading' });

        navigate('/', { replace: true });
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'auth/stopLoading' });
    }
}