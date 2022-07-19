import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

import { generateConceptQuestions } from '../../../actions/practice';

import Button from '../../widgets/Button';
import Practice from './Practice';
import LoadingScreen from '../../widgets/LoadingScreen';

const PracticeConcept = ({ userId }) => {
    const { conceptId } = useParams();

    const dispatch = useDispatch();

    const [questions, setQuestions] = useState(null);

    // Pull state from store
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);
    const settings = useSelector(state => state.settingsSlice.settings);

    // Check if the concept with the given id exists
    const concept = concepts.find(c => c._id === conceptId);

    // Load the concept questions once the concept is fetched
    useEffect(() => {
        if (concept) {
            // Fetch questions
            const fetchConceptQuestions = async () => {
                let questions = await dispatch(generateConceptQuestions(concept._id, settings.questionsPerSession));
                setQuestions(questions);
            };

            fetchConceptQuestions();
        }
    }, [concept, settings.questionsPerSession]);

    // If the concept or its questions hasn't loaded yet, display loading spinner
    if ((!concept && isLoading) || !questions)
        return <LoadingScreen />;

    // If the concept doesn't exist, or is private and does not belong to the current user, return to home
    if ((!concept && !isLoading) || (concept && !concept.public && concept.creator !== userId))
        return <Navigate to="/"/>

    // If the questions loaded and are empty, display error message
    if (questions && !questions.length)
        return (
            <>
                <p>This concept has no practicable questions!</p>
                <Button link="/" text="Go Home" background />
            </>
        );
    
    return <Practice questions={questions} title={concept.title} />;
}

export default PracticeConcept;