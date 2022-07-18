import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import App from './App';

import reducers from './reducers';
import getApi from './api';

const dev = 'http://localhost:5000';
const prod = '/api';

let api = getApi(prod);

const store = createStore(reducers, compose(applyMiddleware(thunk.withExtraArgument(api))));
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
        <App/>
    </Provider>
);