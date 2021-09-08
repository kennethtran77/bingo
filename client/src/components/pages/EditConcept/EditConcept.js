import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';

import ConceptEditor from './QuestionsDisplayer/editors/ConceptEditor'
import QuestionsDisplayer from './QuestionsDisplayer/QuestionsDisplayer';

const EditConcept = ({ userId }) => {
    const { conceptId } = useParams();
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);

    // Check if the concept with the given id exists
    const concept = concepts.find(c => c._id === conceptId);

    if (isLoading && !concept)
        return 'Loading...';

    // If we finished loading but couldn't find the concept, return to homepage
    if ((!concept && !isLoading) || concept.creator !== userId)
        return <Redirect to="/"/>;

    return (
        <>
            <div className="container">
                <ConceptEditor concept={concept} isLoading={isLoading} />
            </div>
            <div className="container">
                <QuestionsDisplayer concept={concept}/>
            </div>
        </>
    );
};

export default EditConcept;