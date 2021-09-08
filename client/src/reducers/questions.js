const questionsReducer = (state = { isLoading: true, questions: [] }, action) => {
    switch (action.type) {
        case 'questions/startLoading':
            return { ...state, isLoading: true };
        case 'questions/stopLoading':
            return { ...state, isLoading: false };
        case 'questions/fetchAll':
            // payload is the list of questions
            return { ...state, questions: action.payload };
        case 'questions/create':
            // payload is the new question
            return { ...state, questions: [ ...state.questions, action.payload ] }
        case 'questions/update':
            // payload is the updated question
            return { ...state, questions: state.questions.map(question => question._id === action.payload._id ? action.payload : question) };
        case 'questions/delete':
            // payload is the id of the question to delete
            return { ...state, questions: state.questions.filter(question => question._id !== action.payload) };
        case 'questions/clear':
            return { ...state, questions: [] };
        default:
            return state;
    }
};

export default questionsReducer;