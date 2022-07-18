import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import PracticeSessionsDisplayer from './PracticeSessionsDisplayer';
import ConceptsDisplayer from '../../widgets/ConceptsDisplayer';
import SearchBox from '../../widgets/SearchBox';
import useTags from '../../widgets/TagsHook';

const Home = ({ userId }) => {
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);

    const [tags, addTag, removeTag, toggleTag] = useTags();
    const [conceptsToDisplay, setConceptsToDisplay] = useState([]);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        if (concepts) {
            setConceptsToDisplay(concepts.filter(concept => concept.creator === String(userId)));
        }
    }, [concepts]);

    return (
        <>
            <div>
                <h2>My Concepts { searched && '(Search Applied)'} </h2>
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
                            setResults={results => {
                                setSearched(true);
                                setConceptsToDisplay(results);
                            }}
                            reset={() => {
                                setSearched(false);
                                setConceptsToDisplay(concepts);
                            }}
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