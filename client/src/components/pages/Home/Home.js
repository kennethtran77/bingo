import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import PracticeSessionsDisplayer from './PracticeSessionsDisplayer';
import ConceptsDisplayer from '../../widgets/ConceptsDisplayer';
import SearchBox from '../../widgets/SearchBox';
import useTags from '../../widgets/TagsHook';
import LoadingSpinner from '../../widgets/LoadingSpinner';

const Home = ({ userId }) => {
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);

    const [tags, addTag, removeTag, toggleTag] = useTags();
    const [conceptsToDisplay, setConceptsToDisplay] = useState([]);

    useEffect(() => {
        if (concepts) {
            setConceptsToDisplay(concepts.filter(concept => concept.creator === String(userId)));
        }
    }, [concepts]);

    if (isLoading)
        return <LoadingSpinner />;

    return (
        <>
            <div>
                <h2>My Concepts</h2>
                <div className="row">
                    <div className="maj">
                        <ConceptsDisplayer
                            userId={userId}
                            showCreator={false}
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
            <div>
                <h2>Completed Practice Sessions</h2>
                <PracticeSessionsDisplayer userId={userId} />
            </div>
        </>
    );
}

export default Home;