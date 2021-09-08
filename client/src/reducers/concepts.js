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
        // case 'concepts/questions/create': {
        //     // payload is an object with keys conceptId and newQuestion
        //     const { conceptId, newQuestion } = action.payload;

        //     // Find the concept to update
        //     const conceptToUpdate = state.concepts.find(concept => concept._id === conceptId);

        //     // Update the concept
        //     const updatedConcept = {
        //         ...conceptToUpdate,
        //         questions: [...conceptToUpdate.questions, newQuestion]
        //     };

        //     return { ...state, concepts: state.concepts.map(concept => concept._id === conceptId ? updatedConcept : concept) };
        // } case 'concepts/questions/update': {
        //     // payload is an object with keys conceptId and updatedQuestion
        //     const { conceptId, updatedQuestion } = action.payload;

        //     // Find the concept to update
        //     const conceptToUpdate = state.concepts.find(concept => concept._id === conceptId);

        //     // Update the concept
        //     const updatedConcept = {
        //         ...conceptToUpdate,
        //         questions: conceptToUpdate.questions.map(question => question._id === updatedQuestion._id ? updatedQuestion : question)
        //     }

        //     return { ...state, concepts: state.concepts.map(concept => concept._id === conceptToUpdate._id ? updatedConcept : concept) };
        // } case 'concepts/questions/delete': {
        //     // payload is an object with keys conceptId and questionId
        //     const { conceptId, questionId } = action.payload;

        //     // Find the concept to update
        //     const conceptToUpdate = state.concepts.find(concept => concept._id === conceptId);

        //     // Update the concept
        //     const updatedConcept = {
        //         ...conceptToUpdate,
        //         questions: conceptToUpdate.questions.filter(question => question._id !== questionId)
        //     }

        //     return { ...state, concepts: state.concepts.map(concept => concept._id === conceptId ? updatedConcept : concept) };
        // }
        default:
            return state;
    }
}

export default conceptsReducer;