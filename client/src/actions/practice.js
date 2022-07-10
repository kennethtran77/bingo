export const fetchPracticeSessions = () => async (dispatch, getState, api) => {
    try {
        dispatch({ type: 'practice/startLoading' });
        const { data } = await api.fetchPracticeSessions();
        dispatch({ type: 'practice/fetchAll', payload: data });
        dispatch({ type: 'practice/stopLoading' });
    } catch (error) {
        console.log(error);
    }
}

export const processSession = (title, inputs, navigate) => async (dispatch, getState, api) => {
    try {
        const { data } = await api.processSession(title, inputs);
        dispatch({ type: 'practice/create', payload: data });

        // Redirect to the results page
        navigate(`/practice/results/${data._id}`, { replace: true });
    } catch (error) {
        console.log(error.message);
    }
}

export const fetchPracticeQuestionChanged = (sessionId, questionId) => async (dispatch, getState, api) => {
    try {
        const { data } = await api.fetchPracticeQuestionChanged(sessionId, questionId);
        return data;
    } catch (error) {
        console.log(error.message);
    }
}

export const generateConceptQuestions = (conceptId, questionsPerSession) => async (dispatch, getState, api) => {
    try {
        const { data } = await api.generateConceptQuestions(conceptId, questionsPerSession);
        return data; 
    } catch (error) {
        console.log(error.message);
    }
}

export const generateCollectionQuestions = (collectionId, questionsPerSession) => async (dispatch, getState, api) => {
    try {
        const { data } = await api.generateCollectionQuestions(collectionId, questionsPerSession);
        return data; 
    } catch (error) {
        console.log(error.message);
    }
}