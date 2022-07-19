import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import ConceptsDisplayer from '../../widgets/ConceptsDisplayer';
import useTags from '../../widgets/TagsHook';

import CollectionEditor from './CollectionEditor';
import SearchBox from '../../widgets/SearchBox';
import LoadingScreen from '../../widgets/LoadingScreen';

const EditCollection = ({ userId }) => {
    const { collectionId } = useParams();
    const { collections, isLoading: isCollectionsLoading } = useSelector(state => state.collectionsSlice);

    const collection = collections.find(c => c._id === collectionId);

    // Load concepts
    const { concepts, isLoading: isConceptsLoading } = useSelector(state => state.conceptsSlice);

    const [selectedConcepts, setSelectedConcepts] = useState([]);
    const [availableConcepts, setAvailableConcepts] = useState([]);
    const [conceptsToDisplay, setConceptsToDisplay] = useState([]);

    // load derived state once `concepts` is fetched from store
    useEffect(() => {
        if (concepts, collection) {
            let selected = [];
            let available = [];

            concepts.forEach(concept => collection.concepts.includes(concept._id) ? selected.push(concept) : available.push(concept));

            setSelectedConcepts(selected);
            setAvailableConcepts(available);
        }
    }, [concepts, collection]);

    // when available concepts updates, set them as the concepts to display
    useEffect(() => {
        if (availableConcepts) {
            setConceptsToDisplay(availableConcepts);
        }
    }, [availableConcepts]);

    const [tags, addTag, removeTag, toggleTag] = useTags();

    const [searched, setSearched] = useState(false);

    if (isCollectionsLoading && !collection)
        return <LoadingScreen />;

    // If we finished loading but couldn't find the collection, return to homepage
    if ((!collection && !isCollectionsLoading) || collection.creator.toString() !== userId)
        return <Navigate to="/"/>;

    return (
        <>
            <div className="container">
                <CollectionEditor
                    collection={collection}
                    isLoading={isCollectionsLoading}
                />
            </div>
            <h2>Selected Concepts</h2>
            <ConceptsDisplayer
                concepts={selectedConcepts}
                isLoading={isConceptsLoading}
                userId={userId}
                showCreator={true}
                collection={collection}
                enableCreating={false}
                handleTagClick={toggleTag}
            />
            <h2>All Concepts { searched && '(Searched Applied)'}</h2>
            <div className="row">
                <div className="maj">
                    <ConceptsDisplayer
                        concepts={conceptsToDisplay}
                        isLoading={isConceptsLoading}
                        userId={userId}
                        showCreator={true}
                        collection={collection}
                        enableCreating={false}
                        handleTagClick={toggleTag}
                    />
                </div>
                <div className="min">
                    <SearchBox
                        searchables={availableConcepts}
                        setResults={results => {
                            setConceptsToDisplay(results);
                            setSearched(true);
                        }}
                        reset={() => {
                            setConceptsToDisplay(availableConcepts);
                            setSearched(false);
                        }}
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