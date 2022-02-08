const usersReducer = (state = { isLoading: false, users: [] }, action) => {
    switch (action.type) {
        case 'users/startLoading':
            return { ...state, isLoading: true };
        case 'users/stopLoading':
            return { ...state, isLoading: false };
        case 'users/fetchAll':
            // payload is the list of users
            return { ...state, users: action.payload };
        case 'users/create':
            // payload is an object with keys _id and username
            return { ...state, users: [ ...state.users, action.payload ] };
        case 'users/update':
            // payload is the new user
            return { ...state, users: state.users.map(user => user._id === action.payload._id ? action.payload : user) };
        case 'users/delete':
            // payload is the user id
            return { ...state, users: state.users.filter(user => user._id !== action.payload) };
        default:
            return state;
    }
};

export default usersReducer;