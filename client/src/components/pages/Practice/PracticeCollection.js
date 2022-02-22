import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useParams, Link } from 'react-router-dom';

import { generateCollectionQuestions } from '../../../api';
import LoadingSpinner from '../../widgets/LoadingSpinner';

import Practice from './Practice';

const PracticeCollection = () => {
    // State hooks
    const [toRender, setToRender] = useState(<LoadingSpinner />);

    const { collectionId } = useParams();

    // Pull state from store
    const { collections, isLoading } = useSelector(state => state.collectionsSlice);
    const settings = useSelector(state => state.settingsSlice.settings);

    // Check if the collection with the given id exists
    const collection = collections.find(c => c._id === collectionId);

    // Load the collection and generate the questions
    useEffect(() => {
        // If the concept hasn't loaded yet
        if (isLoading && !collection) {
            setToRender(<LoadingSpinner />);
            return;
        }

        // If we finished loading but couldn't find the collection, return to homepage
        if (!collection && !isLoading) {
            setToRender(<Redirect to="/"/>);
            return;
        }

        if (!collection.concepts.length) {
            setToRender(
                <>
                    <p>This collection has no concepts!</p>
                    <Link to="/" className="small-button">Go Home</Link>
                </>
            );
            return;
        }

        // Fetch questions
        generateCollectionQuestions(collection._id, settings.questionsPerSession)
            .then(res => {
                const questions = res.data;

                if (!questions.length) {
                    setToRender(
                        <>
                            <p>This collection has no practicable questions!</p>
                            <Link to="/" className="small-button">Go Home</Link>
                        </>
                    );
                    return;
                }

                setToRender(<Practice questions={questions} title={collection.title} />);
            })
            .catch(err => console.log(err));
    }, [collection, isLoading, settings.questionsPerSession]);

    return toRender;
}

export default PracticeCollection;