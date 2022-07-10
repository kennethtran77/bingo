import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Collection from './Collection';

import { createCollection, deleteCollection } from '../../../actions/collections';
import Paginate from '../../widgets/Paginate';
import LoadingSpinner from '../../widgets/LoadingSpinner';
import NewButton from '../../widgets/NewButton';

const CollectionsDisplayer = ({ userId, collections, handleTagClick, isLoading = true }) => {
    const [collectionsToDisplay, setCollectionsToDisplay] = useState([]);
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

    const getListOfCollections = () => {
        return (
            <ul className="remove-bullet">
                { collectionsToDisplay.map((collection) => (
                    <li key={collection._id}>
                        <Collection
                            collection={collection}
                            remove={() => remove(collection)}
                            handleTagClick={handleTagClick}
                        />
                    </li>
                ))}
            </ul>
        );
    };

    return !userId ? (<h2>Please log in to view collections.</h2>) : (
        <>
            { isLoading && <LoadingSpinner/> }
            { !isLoading && !collections.length && <div className="container">There are no collections to display.</div> }
            { !!collections.length && getListOfCollections() }
            <div className="container">
                <div className="left-flex">
                    <NewButton
                        onClick={handleCreateCollection}
                        aria-label="create new collection"
                        tooltip="Create New Collection"
                    />
                </div>
                <div className="center-flex">
                    <Paginate
                        items={collections}
                        itemsPerPage={5}
                        setItemsToDisplay={setCollectionsToDisplay}
                    />
                </div>
            </div>
        </>
    );
}

export default CollectionsDisplayer;