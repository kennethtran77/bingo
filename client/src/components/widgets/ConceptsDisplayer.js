import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Paginate from './Paginate';

import { createConcept, deleteConcept } from '../../actions/concepts';
import ConceptVisualizer from './ConceptVisualizer';

import SearchBox from './SearchBox';
import LoadingSpinner from './LoadingSpinner';

import NewButton from './NewButton';

import './ConceptsDisplayer.css';

/**
 * A component that displays a listing of the given concepts.
 */
const ConceptsDisplayer = ({ title, concepts, isLoading, userId, showCreator, collection, showSearchBar = true, enableCreating = true}) => {
    const [conceptsToDisplay, setConceptsToDisplay] = useState(concepts);
    const [searched, setSearched] = useState(false);

    const dispatch = useDispatch();

    const handleCreateConcept = e => {
        if (!userId)
            return;

        e.preventDefault();
        
        dispatch(createConcept());
    }
    
    return !userId ? (<h2>Please log in to view concepts.</h2>) : (
        <div className="row">
            <div className="container maj">
                { title && <h2>{title}</h2>}
                { searched && <h2>Displaying search results:</h2> }
                <ul className="remove-bullet">
                    { conceptsToDisplay.length ? conceptsToDisplay.map((concept) => (
                        <li key={concept._id}>
                            <ConceptVisualizer
                                concept={concept}
                                remove={() => dispatch(deleteConcept(concept._id))}
                                userId={userId}
                                showCreator={showCreator}
                                collection={collection}
                            />
                        </li>
                    )) :
                        <span>There are no concepts to display.</span>
                    }
                </ul>
                { isLoading && <LoadingSpinner/> }
                { enableCreating &&
                    <NewButton
                        onClick={handleCreateConcept}
                        aria-label="create new concept"
                        tooltip="Create New Concept"
                    />
                }
                <Paginate
                    items={concepts}
                    itemsPerPage={5}
                    setItemsToDisplay={setConceptsToDisplay}
                />
            </div>
            { showSearchBar && (
                <div className="container min search-box">
                    <h2>Search</h2>
                    <SearchBox
                        searchables={concepts}
                        setResults={results => {
                            setConceptsToDisplay(results);
                            setSearched(true);
                        }}
                        reset={() => {
                            setConceptsToDisplay(concepts);
                            setSearched(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default ConceptsDisplayer;