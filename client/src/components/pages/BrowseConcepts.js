import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import SearchBox from '../widgets/SearchBox';
import useTags from '../widgets/TagsHook';
import ConceptsDisplayer from '../widgets/ConceptsDisplayer';

const BrowseConcepts = ({ userId }) => {
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);
    const [tags, addTag, removeTag, toggleTag] = useTags();
    const [conceptsToDisplay, setConceptsToDisplay] = useState([]);
    
    useEffect(() => {
        if (concepts) {
            setConceptsToDisplay(concepts);
        }
    }, [concepts]);

    return (
        <div>
            <h2>All Concepts</h2>
            <div className="row">
                <div className="maj">
                    <ConceptsDisplayer
                        userId={userId}
                        showCreator={true}
                        concepts={conceptsToDisplay}
                        isLoading={isLoading}
                        handleTagClick={toggleTag}
                    />
                </div>
                <div className="min">
                    <SearchBox
                        searchables={concepts}
                        setResults={results => setConceptsToDisplay(results)}
                        reset={() => setConceptsToDisplay(concepts)}
                        tags={tags}
                        addTag={addTag}
                        removeTag={removeTag}
                    />
                </div>
            </div>
        </div>
    );
};

export default BrowseConcepts;