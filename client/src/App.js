import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router';

import decode from 'jwt-decode';

import { fetchConcepts } from './actions/concepts.js';
import { fetchCollections } from './actions/collections.js';
import { fetchPracticeSessions } from './actions/practice.js';
import { fetchSettings, fetchUsernames } from './actions/user.js';

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
    // decodedToken should be an object with key `id` representing the user's id
    const [decodedToken, setDecodedToken] = useState('');
    
    // force refresh
    useSelector(state => state.authSlice);

    const dispatch = useDispatch();

    // Try to decode token whenever `session` changes
    useEffect(() => {
        const checkForToken = () => {
            // fetch json token from localStorage
            const sessionToken = localStorage.getItem('profile');

            if (sessionToken) {
                const parsedToken = JSON.parse(sessionToken);

                if (parsedToken && parsedToken.token) {
                    const decoded = decode(parsedToken.token);
                    setDecodedToken(decoded);
                }
            }
        };

        checkForToken(); // check for token upon App component mounting

        // add window event listener to check localStorage
        window.addEventListener('storage', checkForToken);

        // cleanup function, remove window event listener
        return () => window.removeEventListener('storage', checkForToken);
    }, []);

    // Load data once user ID loads
    useEffect(() => {
        if (decodedToken) {
            dispatch({ type: 'questions/clear' });
            dispatch(fetchConcepts(decodedToken.id));
            dispatch(fetchCollections());
            dispatch(fetchPracticeSessions());
            dispatch(fetchSettings());
            dispatch(fetchUsernames());
        }
    }, [dispatch, decodedToken]);

    // wrap the component in a fragment containing the navbar with the decoded
    // token, and passing userId as props into the component
    const wrap = (Component) => (
        <>
            <Navbar decodedToken={decodedToken} />
            <div className="main">
                { <Component userId={decodedToken.id} /> }
            </div>
        </>
    );

    if (!decodedToken)
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

export default App;