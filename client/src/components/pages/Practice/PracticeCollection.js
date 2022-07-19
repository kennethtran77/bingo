import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

import { generateCollectionQuestions } from '../../../actions/practice';
import Button from '../../widgets/Button';
import LoadingScreen from '../../widgets/LoadingScreen';

import Practice from './Practice';

const PracticeCollection = ({ userId }) => {
    const { collectionId } = useParams();

    const dispatch = useDispatch();

    const [questions, setQuestions] = useState(null);

    // Pull state from store
    const { collections, isLoading } = useSelector(state => state.collectionsSlice);
    const settings = useSelector(state => state.settingsSlice.settings);

    // Check if the collection with the given id exists
    const collection = collections.find(c => c._id === collectionId);

    // Load the collection questions once the collection is fetched
    useEffect(() => {
        if (collection) {
            // Fetch ques
            const fetchQuestions = async () => {
                const questions = await dispatch(generateCollectionQuestions(collection._id, settings.questionsPerSession));
                setQuestions(questions);
            }

            fetchQuestions();
        }
    }, [collection, settings.questionsPerSession]);

    // If the collection or its questions hasn't loaded yet, display loading spinner
    if ((!collection && isLoading) || !questions)
        return <LoadingScreen />;

    // If the collection doesn't exist, or does not belong to the current user, return to home
    if ((!collection && isLoading) || (collection && collection.creator !== userId))
        return <Navigate to="/"/>

    // If the collection is empty, display error message
    if (collection & !collection.concepts.length)
        return (
            <>
                <p>This collection has no concepts!</p>
                <Button link="/" text="Go Home" background />
            </>
        );
    
    // If the questions loaded and are empty, display error message
    if (questions && !questions.length)
        return (
            <>
                <p>This collection has no practicable questions!</p>
                <Button link="/" text="Go Home" background />
            </>
        );
    
    return <Practice questions={questions} title={collection.title} />;
}

export default PracticeCollection;