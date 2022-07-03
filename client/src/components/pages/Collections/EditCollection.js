import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import ConceptsDisplayer from '../../widgets/ConceptsDisplayer';
import LoadingSpinner from '../../widgets/LoadingSpinner';
import useTags from '../../widgets/TagsHook';

import CollectionEditor from './CollectionEditor';
import SearchBox from '../../widgets/SearchBox';

const EditCollection = ({ userId }) => {
    const { collectionId } = useParams();
    const { collections, isLoading } = useSelector(state => state.collectionsSlice);

    const collection = collections.find(c => c._id === collectionId);

    // Load concepts
    const conceptsSlice = useSelector(state => state.conceptsSlice);

    const selectedConcepts = useMemo(() => conceptsSlice.concepts.filter(concept => collection.concepts.includes(concept._id)), [collection.concepts]);
    const allConcepts = useMemo(() => conceptsSlice.concepts.filter(concept => !collection.concepts.includes(concept._id)), [collection.concepts]);

    const [conceptsToDisplay, setConceptsToDisplay] = useState([]);

    useEffect(() => {
        if (allConcepts) {
            setConceptsToDisplay(allConcepts);
        }
    }, [allConcepts]);

    const [tags, addTag, removeTag, handleTagClick] = useTags();

    if (isLoading && !collection)
        return <LoadingSpinner />;

    // If we finished loading but couldn't find the collection, return to homepage
    if ((!collection && !isLoading) || collection.creator.toString() !== userId)
        return <Navigate to="/"/>;

    return (
        <>
            <div className="container">
                <CollectionEditor
                    collection={collection}
                    isLoading={isLoading}
                />
            </div>
            <h2>Selected Concepts</h2>
            <ConceptsDisplayer
                concepts={selectedConcepts}
                isLoading={conceptsSlice.isLoading}
                userId={userId}
                showCreator={true}
                collection={collection}
                enableCreating={false}
                handleTagClick={handleTagClick}
            />
            <h2>All Concepts</h2>
            <div className="row">
                <div className="maj">
                    <ConceptsDisplayer
                        concepts={conceptsToDisplay}
                        isLoading={conceptsSlice.isLoading}
                        userId={userId}
                        showCreator={true}
                        collection={collection}
                        enableCreating={false}
                        handleTagClick={handleTagClick}
                    />
                </div>
                <div className="min">
                    <SearchBox
                        searchables={allConcepts}
                        setResults={results => setConceptsToDisplay(results)}
                        reset={() => setConceptsToDisplay(allConcepts)}
                        tags={tags}
                        addTag={addTag}
                        removeTag={removeTag}
                    />
                </div>
            </div>
        </>
    );
};

export default EditCollection;