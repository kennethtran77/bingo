const commentsReducer = (state = { isLoading: true, comments: [], message: { content: '', colour: 'black' }, messageTimer: null }, action) => {
    switch (action.type) {
        case 'comments/startLoading':
            return { ...state, isLoading: true };
        case 'comments/stopLoading':
            return { ...state, isLoading: false};
        case 'comments/fetchAll':
            // payload is a list of all comments
            return { ...state, comments: action.payload };
        case 'comments/create':
            // payload is the new comment
            return { ...state, comments: [...state.comments, action.payload] };
        case 'comments/delete':
            // payload is the id of the comment to delete
            return { ...state, comments: state.comments.filter(comment => comment._id !== action.payload) };
        case 'comments/update':
            // payload is the updated comment
            return { ...state, comments: state.comments.map(comment => comment._id === action.payload._id ? action.payload : comment) }
        case 'comments/setMessage':
            // payload is the message
            return { ...state, message: action.payload };
        case 'comments/setMessageTimer':
            // payload is the message timer
            return { ...state, messageTimer: action.payload };
        default:
            return state;
    }
};

export default commentsReducer;