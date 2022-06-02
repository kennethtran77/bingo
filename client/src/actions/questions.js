import * as api from '../api/index.js';

// Action handlers

export const fetchQuestions = (concept) => async (dispatch, getState) => {
    try {
        dispatch({ type: 'questions/startLoading' });
        const { data } = await api.fetchQuestions(concept._id);

        dispatch({
            type: 'questions/fetchAll',
            payload: data.concat(getState().questionsSlice.questions)
        });

        // --- update concepts
        dispatch({ type: 'concepts/startLoading' });
        dispatch({
            type: 'concepts/update',
            payload: { ...concept, questions: data }
        })
        dispatch({ type: 'concepts/stopLoading' });
        // ---

        dispatch({ type: 'questions/stopLoading' });
    } catch (error) {
        console.log(error.message);
    }
};

export const createQuestion = (concept) => async (dispatch) => {
    try {
        dispatch({ type: 'questions/startLoading' });
        const { data } = await api.createQuestion(concept._id);
        dispatch({
            type: 'questions/create',
            payload: data
        });

        // --- update concept
        dispatch({ type: 'concepts/startLoading' });
        dispatch({
            type: 'concepts/update',
            payload: { ...concept, questions: [...concept.questions, data._id ]}
        })
        dispatch({ type: 'concepts/stopLoading' });
        // ---

        dispatch({ type: 'questions/stopLoading' });
    } catch (error) {
        console.log(error.message);
    }
};

export const updateQuestion = (concept, questionId, updatedQuestion) => async (dispatch) => {
    try {
        dispatch({ type: 'questions/startLoading' });
        const res = await api.updateQuestion(concept._id, questionId, updatedQuestion);

        if (res.data.updatedQuestion) {
            dispatch({
                type: 'questions/update',
                payload: res.data.updatedQuestion
            });
        }

        dispatch({ type: 'questions/stopLoading' });
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const deleteQuestion = (concept, questionId) => async (dispatch) => {
    try {
        dispatch({ type: 'questions/startLoading' });
        await api.deleteQuestion(concept._id, questionId);
        dispatch({
            type: 'questions/delete',
            payload: questionId
        });

        // --- update concept
        dispatch({ type: 'concepts/startLoading' });
        dispatch({
            type: 'concepts/update',
            payload: { ...concept, questions: concept.questions.filter(question => question !== questionId) }
        });
        dispatch({ type: 'concepts/stopLoading' });
        // ---

        dispatch({ type: 'questions/stopLoading' });
    } catch (error) {
        console.log(error.message);
    }
};