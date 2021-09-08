const settingsReducer = (state = { settings: { questionsPerSession: 10 }, isLoading: false, username: '', message: { content: '', colour: 'black' }, messageTimer: null }, action) => {
    switch (action.type) {
        case 'settings/startLoading':
            return { ...state, isLoading: true };
        case 'settings/stopLoading':
            return { ...state, isLoading: false };
        case 'settings/update':
            // payload is the new settings
            return { ...state, settings: action.payload };
        case 'settings/setUsername':
            // payload is the new username
            return { ...state, username: action.payload };
        case 'settings/setMessage':
            // payload is the message 
            return { ...state, message: action.payload };
        case 'settings/setMessageTimer':
            // payload is the message timer
            return { ...state, messageTimer: action.payload };
        default:
            return state;
    };
};

export default settingsReducer;