import React, { useState } from 'react';

import InputTags from './InputTags';

import './SearchBox.css';

const SearchBox = ({ concepts, setResults, reset }) => {
    const [query, setQuery] = useState('');
    const [tags, setTags] = useState([]);

    const handleSubmit = e => {
        e.preventDefault();

        const checkQuery = concept => concept.title.toLowerCase().includes(query.toLowerCase().trim());
        const lowercaseTags = tags.map(tag => tag.toLowerCase());
        const checkTags = concept => concept.tags.some(tag => lowercaseTags.includes(tag.toLowerCase()));

        // query and tags both empty
        if (!query.trim() && !tags.length) {
            reset();
        // query empty, tags not empty
        } else if (!query.trim() && tags.length) {
            setResults(concepts.filter(concept => checkTags(concept)));
        // query not empty, tags empty
        } else if (query.trim() && !tags.length) {
            setResults(concepts.filter(concept => checkQuery(concept)));
        // query and tags both NOT empty
        } else {
            setResults(concepts.filter(concept => checkQuery(concept) || checkTags(concept)));
        }
    };
    
    const addTag = tag => setTags(prevTags => [ ...prevTags, tag ]);

    const removeTag = tag => setTags(prevTags => prevTags.filter(t => t !== tag));

    return (
        <div id="search-box">
            <form onSubmit={handleSubmit}>
                <label>
                    Title
                    <input
                        id="search-title"
                        type="text"
                        name="query"
                        autoComplete="off"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </label>
                <label>
                    Tags
                    <InputTags
                        tags={tags}
                        addTag={addTag}
                        removeTag={removeTag}
                        maxLength={30}
                    />
                </label>
                <input className="small-button" type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default SearchBox;