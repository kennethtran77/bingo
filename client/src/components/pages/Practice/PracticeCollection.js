import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';

import { generateCollectionQuestions } from '../../../api';
import Button from '../../widgets/Button';
import LoadingSpinner from '../../widgets/LoadingSpinner';

import Practice from './Practice';

const PracticeCollection = ({ userId }) => {
    const { collectionId } = useParams();

    const [questions, setQuestions] = useState(null);

    // Pull state from store
    const { collections, isLoading } = useSelector(state => state.collectionsSlice);
    const settings = useSelector(state => state.settingsSlice.settings);

    // Check if the collection with the given id exists
    const collection = collections.find(c => c._id === collectionId);

    // Load the collection questions once the collection is fetched
    useEffect(() => {
        if (collection) {
            // Fetch questions
            generateCollectionQuestions(collection._id, settings.questionsPerSession)
                .then(res => {
                    const questions = res.data;
                    setQuestions(questions);
                })
                .catch(err => console.log(err));
        }
    }, [collection, settings.questionsPerSession]);

    // If the collection or its questions hasn't loaded yet, display loading spinner
    if ((!collection && isLoading) || !questions)
        return <LoadingSpinner />;

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
        return <p>This collection has no practicable questions!</p>;
    
    return <Practice questions={questions} title={collection.title} />;
}

export default PracticeCollection;