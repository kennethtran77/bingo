import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router';
import { HashRouter as Router } from 'react-router-dom';

import { generateToken } from './actions/auth.js';

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
    const dispatch = useDispatch();

    // try and generate an access token with cookie refresh token upon App component mount
    useEffect(() => {
        dispatch(generateToken());
    }, []);

    const { token } = useSelector(state => state.authSlice);

    // limit routes when no jwt token is present
    if (!token) {
        return (
            <Router basename="/">
                <Routes>
                    <Route path='*' element={<Navigate to="/" />}></Route>
                    <Route path='/signup' element={<Signup />}></Route>
                    <Route path='/login' element={<Login />}></Route>
                    <Route path='/' element={<Login />}></Route>
                </Routes>
            </Router>
        );
    }

    // wrap the component in a fragment containing the navbar with the decoded
    // token, and passing userId as props into the component
    const wrap = (Component) => (
        <>
            <Navbar userId={token.id} />
            <main>
                { <Component userId={token.id} /> }
            </main>
        </>
    );

    return (
        <Router basename="/">
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
        </Router>
    );
};

export default App;