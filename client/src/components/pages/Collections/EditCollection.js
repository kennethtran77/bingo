import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import ConceptsDisplayer from '../../widgets/ConceptsDisplayer';
import LoadingSpinner from '../../widgets/LoadingSpinner';

import CollectionEditor from './CollectionEditor';

const EditCollection = ({ userId }) => {
    const { collectionId } = useParams();
    const { collections, isLoading } = useSelector(state => state.collectionsSlice);

    const collection = collections.find(c => c._id === collectionId);

    // Load concepts
    const conceptsSlice = useSelector(state => state.conceptsSlice);

    const selectedConcepts = conceptsSlice.concepts.filter(concept => collection.concepts.includes(concept._id));
    const allConcepts = conceptsSlice.concepts.filter(concept => !collection.concepts.includes(concept._id));

    if (isLoading && !collection)
        return <LoadingSpinner />;

    // If we finished loading but couldn't find the collection, return to homepage
    if ((!collection && !isLoading) || collection.creator.toString() !== userId)
        return <Redirect to="/"/>;

    return (
        <>
            <div className="container">
                <CollectionEditor
                    collection={collection}
                    isLoading={isLoading}
                />
            </div>
            <ConceptsDisplayer
                title="Selected Concepts"
                concepts={selectedConcepts}
                isLoading={conceptsSlice.isLoading}
                userId={userId}
                showCreator={true}
                collection={collection}
                enableCreating={false}
                showSearchBar={false}
            />
            <ConceptsDisplayer
                title='All Concepts'
                concepts={allConcepts}
                isLoading={conceptsSlice.isLoading}
                userId={userId}
                showCreator={true}
                collection={collection}
                enableCreating={false}
            />
        </>
    );
};

export default EditCollection;