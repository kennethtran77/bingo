import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import ReactPaginate from 'react-paginate';

import { createConcept, deleteConcept } from '../../actions/concepts';
import ConceptVisualizer from './ConceptVisualizer';

import SearchBox from './SearchBox';

import './ConceptsDisplayer.css';

const ConceptsDisplayer = ({ title, concepts, isLoading, userId, showCreator, collection, showSearchBar = true, enableCreating = true}) => {
    const [conceptsToDisplay, setConceptsToDisplay] = useState(concepts);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        setConceptsToDisplay(concepts);
    }, [concepts]);

    // Pagination
    const [page, setPage] = useState(0);

    const conceptsPerPage = 5;
    const pagesVisited = page * conceptsPerPage;
    const pageCount = Math.ceil(conceptsToDisplay.length / conceptsPerPage);
    const slicedConceptsToDisplay = conceptsToDisplay.slice(pagesVisited, pagesVisited + conceptsPerPage);

    const dispatch = useDispatch();

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
            questions: [],
            likes: [],
            dislikes: [],
            comments: []
        };
        
        dispatch(createConcept(newConcept));
    }
    
    const remove = concept => dispatch(deleteConcept(concept._id));

    return !userId ? (<h2>Please log in to view concepts.</h2>) : (
        <div className="row">
            <div className="container maj">
                { title && <h2>{title}</h2>}
                { searched && <h2>Displaying search results:</h2> }
                <ul className="remove-bullet">
                    { slicedConceptsToDisplay.length ? slicedConceptsToDisplay.map((concept, id) => (
                        <li key={id}>
                            <ConceptVisualizer
                                concept={concept}
                                remove={() => remove(concept)}
                                userId={userId}
                                showCreator={showCreator}
                                collection={collection}
                            />
                        </li>
                    )) :
                        <span>It's quite empty here...</span>
                    }
                </ul>
                { isLoading && 'Loading...' }
                { enableCreating && <span onClick={handleCreateConcept} className="plus"></span> }
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