import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

const ViewConcept = ({ userId }) => {
    const { conceptId } = useParams();
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);

    const concept = concepts.find(c => c._id === conceptId);

    if (isLoading && !concept)
        return 'Loading...';

    // If we finished loading but couldn't find the concept, return to homepage
    if (!concept && !isLoading)
        return <Redirect to="/"/>;

    return (
        <div className="container">
            <h1>{ concept.title }</h1>
            <hr />
            <Latex>{concept.text}</Latex>
        </div>
    );
}

export default ViewConcept;