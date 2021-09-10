import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useParams, Link } from 'react-router-dom';

import { generateConceptQuestions } from '../../../api';

import Practice from './Practice';

const PracticeConcept = () => {
    // State hooks
    const [toRender, setToRender] = useState('Loading...');

    const { conceptId } = useParams();

    // Pull state from store
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);
    const settings = useSelector(state => state.settingsSlice.settings);

    // Check if the concept with the given id exists
    const concept = concepts.find(c => c._id === conceptId);

    // Load the concept and generate the questions
    useEffect(() => {
        // If the concept hasn't loaded yet
        if (isLoading && !concept) {
            setToRender('Loading...');
            return;
        }

        // If we finished loading but couldn't find the concept, return to homepage
        if (!concept && !isLoading) {
            setToRender(<Redirect to="/"/>);
            return;
        }

        if (!concept.questions.length) {
            setToRender(
                <>
                    <p>This concept has no practicable questions!</p>
                    <Link to="/" className="small-button">Go Home</Link>
                </>
            );
        }

        // Fetch questions
        generateConceptQuestions(concept._id, settings.questionsPerSession)
            .then(res => {
                const questions = res.data;

                if (!questions.length) {
                    setToRender(
                        <>
                            <p>This concept has no practicable questions!</p>
                            <Link to="/" className="small-button">Go Home</Link>
                        </>
                    );
                    return;
                }

                setToRender(<Practice questions={questions} title={concept.title} />);
            })
            .catch(err => console.log(err));
    }, [concept, isLoading]);

    return toRender;
}

export default PracticeConcept;