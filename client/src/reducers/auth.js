const authReducer = (state = { isLoading: false, message: { content: '', colour: 'black' }, messageTimer: null }, action) => {
    switch (action.type) {
        case 'auth/startLoading':
            return { ...state, isLoading: true };
        case 'auth/stopLoading':
            return { ...state, isLoading: false };
        case 'auth/setMessage':
            // payload is the message
            return { ...state, message: action.payload };
        case 'settings/setMessageTimer':
            // payload is the message timer
            return { ...state, messageTimer: action.payload };
        default:
            return state;
    }
}

export default authReducer;