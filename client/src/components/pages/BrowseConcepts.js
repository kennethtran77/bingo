import React from 'react';

import ConceptsDisplayer from '../widgets/ConceptsDisplayer';

const BrowseConcepts = ({ userId }) => {
    return (
        <>
            <div>
                <h2>All Concepts</h2>
                <ConceptsDisplayer displayAll={true} userId={userId} />
            </div>
        </>
    );
};

export default BrowseConcepts;