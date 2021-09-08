const practiceReducer = (state = { isLoading: true, practiceSessions: []}, action) => {
    switch (action.type) {
        case 'practice/startLoading':
            return { ...state, isLoading: true };
        case 'practice/stopLoading':
            return { ...state, isLoading: false };
        case 'practice/fetchAll':
            // payload is the list of sessions
            return { ...state, practiceSessions: action.payload };
        case 'practice/create':
            // payload is the new practice session
            return { ...state, practiceSessions: [ ...state.practiceSessions, action.payload ] };
        case 'practice/clear':
            // clear the list of practice sessions
            return { ...state, practiceSessions: []};
        default:
            return state;
    }
};

export default practiceReducer;