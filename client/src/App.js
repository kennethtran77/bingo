import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router';

import decode from 'jwt-decode';

import { fetchConcepts } from './actions/concepts.js';
import { fetchCollections } from './actions/collections.js';
import { fetchPracticeSessions } from './actions/practice.js';
import { fetchSettings, fetchUsernames } from './actions/user.js';
import { generateToken } from './actions/auth.js';
import { setAuthHeader } from './api/index.js';

import './App.css';

// Import components
import Navbar from './components/widgets/Navbar';
import EditConcept from './components/pages/EditConcept/EditConcept';
import PracticeConcept from './components/pages/Practice/PracticeConcept';
import Home from './components/pages/Home/Home';
import Error from './components/pages/Error';
import Login from './components/pages/Auth/Login';
import Signup from './components/pages/Auth/Signup';
import Settings from './components/pages/Settings/Settings';
import PracticeResults from './components/pages/PracticeResults';
import BrowseConcepts from './components/pages/BrowseConcepts';
import ViewConcept from './components/pages/ViewConcept/ViewConcept';
import Collections from './components/pages/Collections/Collections';
import EditCollection from './components/pages/Collections/EditCollection';

import PracticeCollection from './components/pages/Practice/PracticeCollection.js';

const App = () => {
    const token = useToken(); 
    const dispatch = useDispatch();

    // Load data once user ID loads
    useEffect(() => {
        if (token) {
            dispatch({ type: 'questions/clear' });
            dispatch(fetchConcepts(token.id));
            dispatch(fetchCollections());
            dispatch(fetchPracticeSessions());
            dispatch(fetchSettings());
            dispatch(fetchUsernames());
        }
    }, [dispatch, token]);

    // wrap the component in a fragment containing the navbar with the decoded
    // token, and passing userId as props into the component
    const wrap = (Component) => (
        <>
            <Navbar decodedToken={token} />
            <div className="main">
                { <Component userId={token.id} /> }
            </div>
        </>
    );

    // limit routes when no jwt token is present
    if (!token)
        return (
            <Routes>
                <Route path='*' element={<Navigate to="/" />}></Route>
                <Route path='/signup' element={<Signup />}></Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/' element={<Login />}></Route>
            </Routes>
        );

    return (
        <>
            <Routes>
                <Route path='*' element={<Error />}></Route>
                <Route exact path="/" element={ wrap(Home) }></Route>
                <Route exact path="/login" element={<Navigate to="/" />}></Route>
                <Route exact path="/signup" element={<Navigate to="/" />}></Route>
                <Route path="/create" element={ wrap(EditConcept) }></Route>
                <Route exact path="/concept/view/:conceptId" element={ wrap(ViewConcept) }></Route>
                <Route exact path='/concept/edit/:conceptId' element={ wrap(EditConcept) }></Route>
                <Route exact path='/practice/concept/:conceptId' element={ wrap(PracticeConcept) }></Route>
                <Route exact path='/collection/edit/:collectionId' element={ wrap(EditCollection) }></Route>
                <Route exact path='/practice/collection/:collectionId' element={ wrap(PracticeCollection) }></Route>
                <Route exact path="/settings" element={ wrap(Settings) }></Route>
                <Route exact path="/browse" element={ wrap(BrowseConcepts) }></Route>
                <Route exact path="/collections" element={ wrap(Collections) }></Route>
                <Route exact path="/practice/results/:sessionId" element={ wrap(PracticeResults) }></Route>
            </Routes>
        </>
    );
};

export const useToken = () => {
    // decodedToken should be an object with key `id` representing the user's id
    const [decodedToken, setDecodedToken] = useState(null);

    const dispatch = useDispatch();

    const refreshToken = () => {
        dispatch(generateToken())
        .then(token => {
            if (token) {
                const decoded = decode(token);
                setDecodedToken(decoded);
                setAuthHeader(token);

                // generate a new access token immediately before expiration
                setTimeout(() => {
                    refreshToken();
                }, ((decoded.exp * 1000) - Date.now()) - 500);
            }
        });
    };

    useEffect(() => {
        refreshToken();
    }, []);

    return decodedToken;
}

export default App;