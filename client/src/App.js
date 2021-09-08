import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router';

import decode from 'jwt-decode';

import { fetchConcepts } from './actions/concepts.js';
import { fetchPracticeSessions } from './actions/practice.js';
import { fetchSettings, fetchUsername } from './actions/user.js';

import './App.css';
// Import components
import Navbar from './components/widgets/Navbar';
import EditConcept from './components/pages/EditConcept/EditConcept';
import PracticeConcept from './components/pages/PracticeConcept/PracticeConcept';
import Home from './components/pages/Home/Home';
import Error from './components/pages/Error';
import Login from './components/pages/Auth/Login';
import Signup from './components/pages/Auth/Signup';
import Settings from './components/pages/Settings/Settings';
import PracticeResults from './components/pages/PracticeResults';
import BrowseConcepts from './components/pages/BrowseConcepts.js';
import ViewConcept from './components/pages/ViewConcept.js';

import 'reactjs-popup/dist/index.css';

const App = () => {
    const session = JSON.parse(localStorage.getItem('profile'));
    const [decodedToken, setDecodedToken] = useState('');
    
    useSelector(state => state.authSlice);

    const dispatch = useDispatch();

    // Load user id
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
            dispatch(fetchConcepts());
            dispatch(fetchPracticeSessions());
            dispatch(fetchSettings());
            dispatch(fetchUsername(decodedToken.id));
        }
    }, [dispatch, decodedToken]);

    const wrap = (Component) => (
        <>
            <Navbar decodedToken={decodedToken} />
            { <Component userId={decodedToken.id} /> }
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
                <Route exact path='/edit/:conceptId' >{ wrap(EditConcept) }</Route>
                <Route exact path='/practice/:conceptId' >{ wrap(PracticeConcept) }</Route>
                <Route exact path="/login" ><Redirect to="/" /></Route>
                <Route exact path="/signup" ><Redirect to="/" /></Route>
                <Route exact path="/settings">{ wrap(Settings) }</Route>
                <Route exact path="/browse" >{ wrap(BrowseConcepts) }</Route>
                <Route exact path="/practice/results/:sessionId">{ wrap(PracticeResults) }</Route>
                <Route exact path="/concept/:conceptId">{ wrap(ViewConcept) }</Route>
                <Route component={Error} />
            </Switch>
        </>
    );
};

export default App;