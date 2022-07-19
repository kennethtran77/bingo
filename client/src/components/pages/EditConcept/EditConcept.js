import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import LoadingScreen from '../../widgets/LoadingScreen';

import ConceptEditor from './QuestionsDisplayer/editors/ConceptEditor'
import QuestionsDisplayer from './QuestionsDisplayer/QuestionsDisplayer';

const EditConcept = ({ userId }) => {
    const { conceptId } = useParams();
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);

    // Check if the concept with the given id exists
    const concept = concepts.find(c => c._id === conceptId);

    if (isLoading && !concept)
        return <LoadingScreen />;

    // If we finished loading but couldn't find the concept, return to homepage
    if ((!concept && !isLoading) || concept.creator !== userId)
        return <Navigate to="/"/>;

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