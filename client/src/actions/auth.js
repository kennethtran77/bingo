import * as api from '../api/index.js';
import { fetchPracticeSessions } from './practice.js';

const setTimedMessage = (message, colour, interval) => (dispatch, getState) => {
    dispatch({ type: 'auth/setMessage', payload: { content: message, colour }});

    let timer = getState().authSlice.messageTimer;
    const newTimer = setTimeout(() => {
        dispatch({ type: 'auth/setMessage', payload: '' });
        dispatch({ type: 'auth/setMessageTimer', payload: null });
    }, interval);

    // reset the timer if it already exists
    if (timer)
        clearTimeout(timer);

    dispatch({ type: 'auth/setMessageTimer', payload: newTimer });
}

export const login = (loginInput, history) => async (dispatch) => {
    try {
        // login
        dispatch({ type: 'auth/startLoading' });
        const { data } = await api.login(loginInput);

        // load practice sessions
        if (data?.token) {
            localStorage.setItem('profile', JSON.stringify(data));
            dispatch(fetchPracticeSessions());
        }

        dispatch({ type: 'auth/stopLoading' });

        history.push('/');
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'auth/stopLoading' });
    }
};

export const signUp = (signUpInput, history) => async (dispatch) => {
    try {
        // signup
        dispatch({ type: 'auth/startLoading' });
        const { data } = await api.signUp(signUpInput);

        localStorage.setItem('profile', JSON.stringify(data));
        dispatch({ type: 'auth/stopLoading' });

        history.push('/');
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'auth/stopLoading' });
    }
}