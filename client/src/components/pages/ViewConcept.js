import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ViewConcept = ({ userId }) => {
    const { conceptId } = useParams();
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);

    const concept = concepts.find(c => c._id === conceptId);

    if (isLoading && !concept)
        return 'Loading...';

    // If we finished loading but couldn't find the concept, return to homepage
    if (!concept && !isLoading)
        return <Redirect to="/"/>;

    console.log(concept.text);

    return (
        <div className="container">
            <h1>{ concept.title }</h1>
            <hr />
            <p dangerouslySetInnerHTML={ { __html: concept.text }}></p>
        </div>
    );
}

export default ViewConcept;