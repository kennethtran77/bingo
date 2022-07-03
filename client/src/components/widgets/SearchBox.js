import React, { useState } from 'react';
import Button from './Button';

import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import InputTags from './InputTags';

import styles from './SearchBox.module.css';

// searchables needs a title and tags field
const SearchBox = ({ searchables, setResults, reset, tags, addTag, removeTag }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = () => {
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

    const handleClear = () => {
        setQuery('');
        tags.forEach(tag => removeTag(tag));
        reset();
    };

    return (
        <div className={`${styles["search-box"]} container min`}>
            <h2>Search</h2>
            <form>
                <label>
                    Title
                    <input
                        id={styles["search-title"]}
                        type="text"
                        name="query"
                        autoComplete="off"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e) }}
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
                        onKeyDown={e => { if (e.key === 'Enter' && !query.length) handleSubmit(e) }}
                    />
                </label>
                <div className="flex gap">
                    <Button Icon={<SearchIcon />} text="Search" onClick={handleSubmit} background={true} />
                    <Button Icon={<ClearAllIcon />} text="Clear" onClick={handleClear} />
                </div>
            </form>
        </div>
    );
}

export default SearchBox;