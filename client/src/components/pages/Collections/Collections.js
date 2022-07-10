import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SearchBox from '../../widgets/SearchBox';
import useTags from '../../widgets/TagsHook';

import CollectionsDisplayer from './CollectionsDisplayer';

const Collections = ({ userId }) => {
    const { collections, isLoading } = useSelector(state => state.collectionsSlice);
    const [collectionsToDisplay, setCollectionsToDisplay] = useState([]);
    const [tags, addTag, removeTag, toggleTag] = useTags();

    useEffect(() => {
        if (collections) {
            setCollectionsToDisplay(collections);
        }
    }, [collections]);

    return (
        <div>
            <h2>My Collections</h2>
            <div className="row">
                <div className="maj">
                    <CollectionsDisplayer
                        userId={userId}
                        collections={collectionsToDisplay}
                        isLoading={isLoading}
                        handleTagClick={toggleTag}
                    />
                </div>
                <div className="min">
                    <SearchBox
                        searchables={collections}
                        setResults={results => setCollectionsToDisplay(results)}
                        reset={() => setCollectionsToDisplay(collections)}
                        tags={tags}
                        addTag={addTag}
                        removeTag={removeTag}
                    />
                </div>
            </div>
        </div>
    );
};

export default Collections;