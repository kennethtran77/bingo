import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Collection from './Collection';

import SearchBox from '../../widgets/SearchBox';

import { createCollection, deleteCollection } from '../../../actions/collections';
import Paginate from '../../widgets/Paginate';
import LoadingSpinner from '../../widgets/LoadingSpinner';
import NewButton from '../../widgets/NewButton';

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
    
    const handleCreateCollection = e => {
        if (!userId)
            return;

        e.preventDefault();

        dispatch(createCollection());
    }
    
    const remove = collection => dispatch(deleteCollection(collection._id));

    return !userId ? (<h2>Please log in to view collections.</h2>) : (
        <div className="row">
            <div className="container maj">
                { searched && <h2>Displaying search results:</h2> }
                <ul className="remove-bullet">
                    { collectionsToDisplay.length ? collectionsToDisplay.map((collection) => (
                        <li key={collection._id}>
                            <Collection
                                collection={collection}
                                remove={() => remove(collection)}
                            />
                        </li>
                    )) :
                        <span>You haven't created any collections yet.</span>
                    }
                </ul>
                { isLoading && <LoadingSpinner /> }
                <NewButton onClick={handleCreateCollection} className="plus" aria-label="Create New Collection" tooltip="Create New Collection" />
                <Paginate
                    items={collections}
                    itemsPerPage={5}
                    setItemsToDisplay={setCollectionsToDisplay}
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