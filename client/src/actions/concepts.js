import * as api from '../api/index.js';

import { fetchQuestions } from '../actions/questions';

// Action handlers

export const fetchConcepts = (userId) => async (dispatch) => {
    try {
        dispatch({ type: 'concepts/startLoading' });
        const { data } = await api.fetchConcepts();
        dispatch({ type: 'concepts/fetchAll', payload: data });
        dispatch({ type: 'concepts/stopLoading' });

        // fetch questions after the concepts have been fetched
        data.forEach(concept => {
            if (concept.creator.toString() === userId) {
                dispatch(fetchQuestions(concept));
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};

export const createConcept = (concept) => async (dispatch) => {
    try {
        dispatch({ type: 'concepts/startLoading' });
        const { data } = await api.createConcept(concept);
        dispatch({ type: 'concepts/create', payload: data });
        dispatch({ type: 'concepts/stopLoading' });
    } catch (error) {
        console.log(error.message);
    }
};

export const updateConcept = (conceptId, concept) => async (dispatch) => {
    try {
        dispatch({ type: 'concepts/startLoading' });
        const { data } = await api.updateConcept(conceptId, concept);
        dispatch({ type: 'concepts/update', payload: data });
        dispatch({ type: 'concepts/stopLoading' });
    } catch (error) {
        console.log(error.message);
    }
};

export const deleteConcept = (conceptId) => async (dispatch) => {
    try {
        dispatch({ type: 'concepts/startLoading' });
        await api.deleteConcept(conceptId);
        dispatch({ type: 'concepts/delete', payload: conceptId });
        dispatch({ type: 'concepts/stopLoading' });
    } catch (error) {
        console.log(error.message);
    }
};