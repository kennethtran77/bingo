import React from 'react';

import { useSelector } from 'react-redux';

import ConceptsDisplayer from '../widgets/ConceptsDisplayer';

const BrowseConcepts = ({ userId }) => {
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);

    return (
        <>
            <div>
                <h2>All Concepts</h2>
                <ConceptsDisplayer
                    concepts={concepts}
                    isLoading={isLoading}
                    showCreator={true}
                    userId={userId}
                />
            </div>
        </>
    );
};

export default BrowseConcepts;