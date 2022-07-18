import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Paginate from './Paginate';

import { createConcept, deleteConcept } from '../../actions/concepts';
import Concept from './Concept';

import LoadingSpinner from './LoadingSpinner';

import NewButton from './NewButton';

/**
 * A component that displays a listing of the given concepts.
 */
const ConceptsDisplayer = ({ concepts, isLoading, userId, showCreator, collection, handleTagClick, enableCreating = true}) => {
    const [conceptsToDisplay, setConceptsToDisplay] = useState(concepts);
    
    useEffect(() => {
        setConceptsToDisplay(concepts);
    }, [concepts]);

    const dispatch = useDispatch();

    const handleCreateConcept = e => {
        if (!userId)
            return;

        e.preventDefault();
        
        dispatch(createConcept());
    }

    const getListOfConcepts = () => {
        return (
            <ul className="remove-bullet">
                { conceptsToDisplay.map((concept) => (
                    <li key={concept._id}>
                        <Concept
                            concept={concept}
                            remove={() => dispatch(deleteConcept(concept._id))}
                            userId={userId}
                            showCreator={showCreator}
                            collection={collection}
                            handleTagClick={handleTagClick}
                        />
                    </li>
                ))}
            </ul>
        );
    };
    
    return !userId ? (<h2>Please log in to view concepts.</h2>) : (
        <>
            { isLoading && <LoadingSpinner/> }
            { (!isLoading && !conceptsToDisplay.length) ? <div className="container">There are no concepts to display.</div> : getListOfConcepts() }
            <div className="container">
                <div className="left-flex">
                    { enableCreating &&
                        <NewButton
                            onClick={handleCreateConcept}
                            aria-label="create new concept"
                            tooltip="Create New Concept"
                        />
                    }
                </div>
                <div className="center-flex">
                    <Paginate
                        items={concepts}
                        itemsPerPage={5}
                        setItemsToDisplay={setConceptsToDisplay}
                    />
                </div>
            </div>
        </>
    );
}

export default ConceptsDisplayer;