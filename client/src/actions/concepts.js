import { fetchQuestions } from '../actions/questions';
import { fetchComments } from './comments.js';

// Action handlers

export const fetchConcepts = (userId) => async (dispatch, getState, api) => {
    try {
        dispatch({ type: 'concepts/startLoading' });
        const { data } = await api.fetchConcepts();
        dispatch({ type: 'concepts/fetchAll', payload: data });
        dispatch({ type: 'concepts/stopLoading' });

        // fetch questions and comments after the concepts have been fetched
        data.forEach(concept => {
            if (concept.creator.toString() === userId) {
                dispatch(fetchQuestions(concept));
            }
            dispatch(fetchComments(concept));
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const createConcept = () => async (dispatch, getState, api) => {
    try {
        dispatch({ type: 'concepts/startLoading' });
        const { data } = await api.createConcept();
        dispatch({ type: 'concepts/create', payload: data });
        dispatch({ type: 'concepts/stopLoading' });
    } catch (error) {
        console.log(error.message);
    }
};

export const updateConcept = (conceptId, concept) => async (dispatch, getState, api) => {
    try {
        dispatch({ type: 'concepts/startLoading' });
        const res = await api.updateConcept(conceptId, concept);

        if (res.data.updatedConcept)
            dispatch({ type: 'concepts/update', payload: res.data.updatedConcept });

        dispatch({ type: 'concepts/stopLoading' });
        return res;
    } catch (error) {
        console.log(error.message);
    }
};

export const deleteConcept = (conceptId) => async (dispatch, getState, api) => {
    try {
        dispatch({ type: 'concepts/startLoading' });
        await api.deleteConcept(conceptId);
        dispatch({ type: 'concepts/delete', payload: conceptId });
        dispatch({ type: 'concepts/stopLoading' });
    } catch (error) {
        console.log(error.message);
    }
};

export const likeConcept = (conceptId) => async (dispatch, getState, api) => {
    try {
        // data is the concept object with the updated likes
        const { data } = await api.likeConcept(conceptId);
        dispatch({ type: 'concepts/update', payload: data });
    } catch (error) {
        console.log(error.message);
    }
}

export const dislikeConcept = (conceptId) => async (dispatch, getState, api) => {
    try {
        // data is the concept object with the updated dislikes
        const { data } = await api.dislikeConcept(conceptId);
        dispatch({ type: 'concepts/update', payload: data });
    } catch (error) {
        console.log(error.message);
    }
}