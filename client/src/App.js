import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router';

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

import 'reactjs-popup/dist/index.css';
import PracticeCollection from './components/pages/Practice/PracticeCollection.js';

const App = () => {
    // fetch json token from localStorage
    const session = JSON.parse(localStorage.getItem('profile'));
    // decodedToken should be an object with key `id` representing the user's id
    const [decodedToken, setDecodedToken] = useState('');
    
    // force refresh
    useSelector(state => state.authSlice);

    const dispatch = useDispatch();

    // Try to decode token whenever `session` changes
    useEffect(() => {
        if (session?.token) {
            const decoded = decode(session?.token);
            setDecodedToken(decoded);
        }
    }, [session?.token]);

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

    return !decodedToken ? (
        <Switch>
            <Route path='/signup'><Signup /></Route>
            <Route><Login /></Route>
        </Switch>
    ) : (
        <>
            <Switch>
                <Route exact path="/">{ wrap(Home) }</Route>
                <Route path="/create" >{ wrap(EditConcept) }</Route>
                <Route exact path="/concept/view/:conceptId">{ wrap(ViewConcept) }</Route>
                <Route exact path='/concept/edit/:conceptId' >{ wrap(EditConcept) }</Route>
                <Route exact path='/practice/concept/:conceptId' >{ wrap(PracticeConcept) }</Route>
                <Route exact path='/collection/edit/:collectionId' >{ wrap(EditCollection) }</Route>
                <Route exact path='/practice/collection/:collectionId' >{ wrap(PracticeCollection) }</Route>
                <Route exact path="/login" ><Redirect to="/" /></Route>
                <Route exact path="/signup" ><Redirect to="/" /></Route>
                <Route exact path="/settings">{ wrap(Settings) }</Route>
                <Route exact path="/browse" >{ wrap(BrowseConcepts) }</Route>
                <Route exact path="/collections" >{ wrap(Collections) }</Route>
                <Route exact path="/practice/results/:sessionId">{ wrap(PracticeResults) }</Route>
                <Route component={Error} />
            </Switch>
        </>
    );
};

export default App;