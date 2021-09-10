import { combineReducers } from 'redux';

import conceptsReducer from './concepts';
import questionsReducer from './questions';
import authReducer from './auth';
import practiceReducer from './practice';
import settingsReducer from './settings';
import collectionsReducer from './collections';

export default combineReducers({
    conceptsSlice: conceptsReducer,
    questionsSlice: questionsReducer,
    authSlice: authReducer,
    practiceSlice: practiceReducer,
    settingsSlice: settingsReducer,
    collectionsSlice: collectionsReducer
});