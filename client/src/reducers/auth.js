const authReducer = (state = { isLoading: true, token: null, signupKeyEnabled: false, message: { content: '', colour: 'black' }, messageTimer: null }, action) => {
    switch (action.type) {
        case 'auth/startLoading':
            return { ...state, isLoading: true };
        case 'auth/stopLoading':
            return { ...state, isLoading: false };
        case 'auth/setToken':
            // payload is the access token
            return { ...state, token: action.payload };
        case 'auth/setSignupKeyEnabled':
            // payload is the boolean value
            return { ...state, signupKeyEnabled: action.payload };
        case 'auth/setMessage':
            // payload is the message
            return { ...state, message: action.payload };
        case 'auth/setMessageTimer':
            // payload is the message timer
            return { ...state, messageTimer: action.payload };
        default:
            return state;
    }
}

export default authReducer;