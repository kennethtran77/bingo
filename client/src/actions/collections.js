import * as api from '../api';

export const fetchCollections = () => async (dispatch) => {
    try {
        dispatch({ type: 'collections/startLoading' });
        const { data } = await api.fetchCollections();
        dispatch({ type: 'collections/fetchAll', payload: data });
        dispatch({ type: 'collections/stopLoading' });
    } catch (error) {
        console.log(error);
        dispatch({ type: 'collections/stopLoading' });
    }
};

export const addToCollection = (collection, conceptId) => async (dispatch) => {
    try {
        dispatch({ type: 'collections/startLoading' });
        await api.addToCollection(collection._id, conceptId);
        dispatch({ type: 'collections/addTo', payload: conceptId });
        dispatch({ type: 'collections/stopLoading' });
    } catch (error) {
        console.log(error);
        dispatch({ type: 'collections/stopLoading' });
    }
};

export const removeFromCollection = (collection, conceptId) => async (dispatch) => {
    try {
        dispatch({ type: 'collections/startLoading' });
        await api.removeFromCollection(collection._id, conceptId);
        dispatch({ type: 'collections/removeFrom', payload: conceptId });
        dispatch({ type: 'collections/stopLoading' });
    } catch (error) {
        console.log(error);
        dispatch({ type: 'collections/stopLoading' });
    }
};

export const createCollection = (collectionName) => async (dispatch) => {
    try {
        const newCollection = { title: collectionName, concepts: [], tags: [] };

        dispatch({ type: 'collections/startLoading' });
        const { data } = await api.createCollection(newCollection);
        dispatch({ type: 'collections/create', payload: data });
        dispatch({ type: 'collections/stopLoading' });
    } catch (error) {
        console.log(error);
        dispatch({ type: 'collections/stopLoading' });
    }
};

export const deleteCollection = (collectionId) => async (dispatch) => {
    try {
        dispatch({ type: 'collections/startLoading' });
        await api.deleteCollection(collectionId);
        dispatch({ type: 'collections/delete', payload: collectionId });
        dispatch({ type: 'collections/stopLoading' });
    } catch (error) {
        console.log(error);
        dispatch({ type: 'collections/stopLoading' });
    }
};