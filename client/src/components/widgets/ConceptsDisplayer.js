import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ReactPaginate from 'react-paginate';

import { createConcept, deleteConcept } from '../../actions/concepts';
import ConceptVisualizer from './ConceptVisualizer';

import SearchBox from './SearchBox';

import './ConceptsDisplayer.css';

const ConceptsDisplayer = ({ displayAll, userId }) => {
    const [conceptsToDisplay, setConceptsToDisplay] = useState([]);
    const [searched, setSearched] = useState(false);

    // Pagination
    const [page, setPage] = useState(0);

    const conceptsPerPage = 5;
    const pagesVisited = page * conceptsPerPage;
    const pageCount = Math.ceil(conceptsToDisplay.length / conceptsPerPage);
    const slicedConceptsToDisplay = conceptsToDisplay.slice(pagesVisited, pagesVisited + conceptsPerPage);

    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);
    const dispatch = useDispatch();

    const getConceptsToDisplay = useCallback(() => {
        if (concepts && userId) {
            return displayAll ? concepts : concepts.filter(concept => concept.creator === String(userId));
        }
    }, [displayAll, concepts, userId]);

    useEffect(() => {
        setConceptsToDisplay(getConceptsToDisplay());
    }, [concepts, getConceptsToDisplay]);

    const handlePageClick = ({ selected }) => setPage(selected);

    const handleCreateConcept = e => {
        if (!userId)
            return;

        e.preventDefault();

        const newConcept = {
            title: 'New Concept',
            text: '',
            tags: [],
            public: true,
            questions: []
        };
        
        dispatch(createConcept(newConcept));
    }
    
    const remove = concept => {
        if (window.confirm('Are you sure you want to delete this concept?')) {
            dispatch(deleteConcept(concept._id));
        };
    }

    return !userId ? (<h2>Please log in to view concepts.</h2>) : (
        <div className="row">
            <div className="container maj">
                { searched && <h2>Displaying search results:</h2> }
                <ul className="remove-bullet">
                    { slicedConceptsToDisplay.length ? slicedConceptsToDisplay.map((concept, id) => (
                        <li key={id}>
                            <ConceptVisualizer
                                concept={concept}
                                remove={() => remove(concept)}
                                displayAll={displayAll}
                                userId={userId}
                            />
                        </li>
                    )) :
                        <span>It's quite empty here...</span>
                    }
                </ul>
                { isLoading && 'Loading...' }
                <span onClick={handleCreateConcept} className="plus"></span>
                <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination-button"}
                    previousLinkClassName={"previous-button"}
                    nextLinkClassName={"next-button"}
                    disabledClassName={"pagination-disabled"}
                    activeClassName={"pagination-active"}
                />
            </div>
            <div className="container min search-box">
                <h2>Search</h2>
                <SearchBox
                    searchables={concepts}
                    setResults={results => {
                        setConceptsToDisplay(results);
                        setSearched(true);
                    }}
                    reset={() => {
                        setConceptsToDisplay(getConceptsToDisplay());
                        setSearched(false);
                    }}
                />
            </div>
        </div>
    );
}

export default ConceptsDisplayer;