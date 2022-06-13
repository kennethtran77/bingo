import decode from 'jwt-decode';

import * as api from '../api/index.js';

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

export const generateToken = () => async (dispatch) => {
    try {
        dispatch({ type: 'auth/startLoading' });
        const { data } = await api.generateToken();
        dispatch({ type: 'auth/stopLoading' });
        return data;
    } catch (error) {
        console.log(error);
        dispatch({ type: 'auth/stopLoading' });
    }
}

export const login = (loginInput) => async (dispatch) => {
    try {
        // login
        dispatch({ type: 'auth/startLoading' });
        const { data } = await api.login(loginInput);
        dispatch({ type: 'auth/stopLoading' });

        if (!data.success) {
            dispatch(setTimedMessage(data.message, 'red', 2500));
            return;
        }

        window.location.reload();
        return data.token;
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'auth/stopLoading' });
    }
};

export const signUp = (signUpInput) => async (dispatch) => {
    try {
        // signup
        dispatch({ type: 'auth/startLoading' });
        // data is an object with key `token`
        const { data } = await api.signUp(signUpInput);
        dispatch({ type: 'auth/stopLoading' });

        if (!data.success) {
            dispatch(setTimedMessage(data.message, 'red', 2500));
            return;
        }

        // userId is the id of the newly created user account
        const userId = decode(data.token).id;
        // update users slice
        dispatch({
            type: 'users/create',
            payload: { _id: userId, username: signUpInput.username }
        });

        dispatch({ type: 'auth/stopLoading' });
        window.location.reload();
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'auth/stopLoading' });
    }
}

export const logout = () => async (dispatch) => {
    try {
        dispatch({ type: 'auth/startLoading' });
        await api.clearSession();
        dispatch({ type: 'auth/stopLoading' });
    } catch (error) {
        console.log(error);
        dispatch({ type: 'auth/stopLoading' });
    }
}