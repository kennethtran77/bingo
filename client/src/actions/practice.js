import * as api from '../api/index.js';

export const fetchPracticeSessions = () => async (dispatch) => {
    try {
        dispatch({ type: 'practice/startLoading' });
        const { data } = await api.fetchPracticeSessions();
        dispatch({ type: 'practice/fetchAll', payload: data });
        dispatch({ type: 'practice/stopLoading' });
    } catch (error) {
        console.log(error);
    }
}

export const processSession = (title, inputs, history) => async (dispatch) => {
    try {
        const { data } = await api.processSession(title, inputs);
        dispatch({ type: 'practice/create', payload: data });

        // Redirect to the results page
        history.push(`/practice/results/${data._id}`);
    } catch (error) {
        console.log(error.message);
    }
}