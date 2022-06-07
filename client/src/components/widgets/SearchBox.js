import React, { useState } from 'react';

import InputTags from './InputTags';

import styles from './SearchBox.module.css';

// searchables needs a title and tags field
const SearchBox = ({ searchables, setResults, reset }) => {
    const [query, setQuery] = useState('');
    const [tags, setTags] = useState([]);

    const handleSubmit = e => {
        e.preventDefault();

        const checkQuery = searchable => searchable.title.toLowerCase().includes(query.toLowerCase().trim());
        const lowercaseTags = tags.map(tag => tag.toLowerCase());
        const checkTags = searchable => searchable.tags.some(tag => lowercaseTags.includes(tag.toLowerCase()));

        // query and tags both empty
        if (!query.trim() && !tags.length) {
            reset();
        // query empty, tags not empty
        } else if (!query.trim() && tags.length) {
            setResults(searchables.filter(searchable => checkTags(searchable)));
        // query not empty, tags empty
        } else if (query.trim() && !tags.length) {
            setResults(searchables.filter(searchable => checkQuery(searchable)));
        // query and tags both NOT empty
        } else {
            setResults(searchables.filter(searchable => checkQuery(searchable) || checkTags(searchable)));
        }
    };
    
    const addTag = tag => setTags(prevTags => [ ...prevTags, tag ]);

    const removeTag = tag => setTags(prevTags => prevTags.filter(t => t !== tag));

    return (
        <div id={styles['search-box']}>
            <form onSubmit={handleSubmit}>
                <label>
                    Title
                    <input
                        id={styles["search-title"]}
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
                        id={styles["search-tags"]}
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