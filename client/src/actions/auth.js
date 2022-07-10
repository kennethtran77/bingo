import decode from 'jwt-decode';

import { fetchConcepts } from './concepts.js';
import { fetchCollections } from './collections.js';
import { fetchPracticeSessions } from './practice.js';
import { fetchSettings, fetchUsernames } from './user.js';

const setTimedMessage = (message, colour, interval) => (dispatch, getState, api) => {
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

const fetchData = (userId) => async (dispatch, getState) => {
    if (!getState().conceptsSlice.concepts.length) dispatch(fetchConcepts(userId));
    if (!getState().collectionsSlice.collections.length) dispatch(fetchCollections());
    if (!getState().practiceSlice.practiceSessions.length) dispatch(fetchPracticeSessions());
    if (!getState().usersSlice.users.length) dispatch(fetchUsernames());
    dispatch(fetchSettings());
}

export const generateToken = () => async (dispatch, getState, api) => {
    const { currToken } = getState().authSlice;

    if (currToken) {
        console.log("Error: token already exists");
        dispatch(fetchData());
        return;
    }

    async function refreshToken() {
        const { data } = await api.generateToken();

        if (!data.success) {
            // clear the token in store
            dispatch({ type: 'auth/setToken', payload: null });
            // clear other data
            api.setBearerToken(null);
            return;
        }

        const decoded = decode(data.token);
        dispatch({ type: 'auth/setToken', payload: decoded });

        // put the access token into Authorization header 
        api.setBearerToken(data.token);

        // load data
        dispatch(fetchData(decoded.id));

        // generate a new access token immediately before expiration
        setTimeout(() => {
            refreshToken();
        }, (((decoded.exp * 1000) - 500) - Date.now()));
    }

    refreshToken();
}

export const fetchSignupKeyEnabled = () => async (dispatch, getState, api) => {
    try {
        const { data } = await api.fetchSignupKeyEnabled();
        dispatch({ type: 'auth/setSignupKeyEnabled', payload: data });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export const login = (loginInput) => async (dispatch, getState, api) => {
    try {
        // login
        dispatch({ type: 'auth/startLoading' });
        const { data } = await api.login(loginInput);

        if (!data.success) {
            dispatch(setTimedMessage(data.message, 'red', 2500));
            return;
        }

        // assert that refresh token is stored in httpOnly cookie
        await dispatch(generateToken());

        dispatch({ type: 'auth/stopLoading' });
        return data.token;
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'auth/stopLoading' });
    }
};

export const signUp = (signUpInput) => async (dispatch, getState, api) => {
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

        // assert that refresh token is stored in httpOnly cookie
        await dispatch(generateToken());

        dispatch({ type: 'auth/stopLoading' });
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'auth/stopLoading' });
    }
}

export const logout = () => async (dispatch, getState, api) => {
    try {
        dispatch({ type: 'auth/startLoading' });
        await api.clearSession();
        dispatch({ type: 'auth/stopLoading' });
        window.location.reload();
    } catch (error) {
        console.log(error);
        dispatch({ type: 'auth/stopLoading' });
    }
}