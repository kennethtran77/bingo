const conceptsReducer = (state = { isLoading: true, concepts: [] }, action) => {
    switch (action.type) {
        case 'concepts/startLoading':
            return { ...state, isLoading: true };
        case 'concepts/stopLoading':
            return { ...state, isLoading: false };
        case 'concepts/fetchAll':
            // payload is the list of concepts
            return { ...state, concepts: action.payload };
        case 'concepts/create':
            // payload is the new concept
            return { ...state, concepts: [ ...state.concepts, action.payload ] };
        case 'concepts/update':
            // payload is the new concept
            return { ...state, concepts: state.concepts.map(concept => concept._id === action.payload._id ? action.payload : concept) };
        case 'concepts/delete':
            // payload is the concept id
            return { ...state, concepts: state.concepts.filter(concept => concept._id !== action.payload) };
        default:
            return state;
    }
}

export default conceptsReducer;