import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ReactPaginate from 'react-paginate';

import CollectionVisualizer from './CollectionVisualizer';

import SearchBox from '../../widgets/SearchBox';

import '../../widgets/ConceptsDisplayer.css';

import { createCollection, deleteCollection } from '../../../actions/collections';

const CollectionsDisplayer = ({ userId }) => {
    const [searched, setSearched] = useState(false);
    const [collectionsToDisplay, setCollectionsToDisplay] = useState([]);

    const { collections, isLoading } = useSelector(state => state.collectionsSlice);
    const dispatch = useDispatch();

    useEffect(() => {
        if (collections) {
            setCollectionsToDisplay(collections);
        }
    }, [collections]);
    
    // Pagination
    const [page, setPage] = useState(0);

    const collectionsPerPage = 5;
    const pagesVisited = page * collectionsPerPage;
    const pageCount = Math.ceil(collectionsToDisplay.length / collectionsPerPage);
    const slicedCollectionsToDisplay = collectionsToDisplay.slice(pagesVisited, pagesVisited + collectionsPerPage);

    const handlePageClick = ({ selected }) => setPage(selected);

    const handleCreateCollection = e => {
        if (!userId)
            return;

        e.preventDefault();

        dispatch(createCollection('New Collection'));
    }
    
    const remove = collection => dispatch(deleteCollection(collection._id));

    return !userId ? (<h2>Please log in to view collections.</h2>) : (
        <div className="row">
            <div className="container maj">
                { searched && <h2>Displaying search results:</h2> }
                <ul className="remove-bullet">
                    { slicedCollectionsToDisplay.length ? slicedCollectionsToDisplay.map((collection, id) => (
                        <li key={id}>
                            <CollectionVisualizer
                                collection={collection}
                                remove={() => remove(collection)}
                            />
                        </li>
                    )) :
                        <span>It's quite empty here...</span>
                    }
                </ul>
                { isLoading && 'Loading...' }
                <span onClick={handleCreateCollection} className="plus"></span>
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
                    searchables={collections}
                    setResults={results => {
                        setCollectionsToDisplay(results);
                        setSearched(true);
                    }}
                    reset={() => {
                        setCollectionsToDisplay(collections);
                        setSearched(false);
                    }}
                />
            </div>
        </div>
    );
}

export default CollectionsDisplayer;