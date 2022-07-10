import { useState } from 'react';

const useTags = () => {
    const [tags, setTags] = useState([]);
    
    const addTag = tag => setTags(prevTags => [ ...prevTags, tag ]);
    const removeTag = tag => setTags(prevTags => prevTags.filter(t => t !== tag));
    const toggleTag = tag => tags.includes(tag) ? removeTag(tag) : addTag(tag);
    
    return [tags, addTag, removeTag, toggleTag];
}

export default useTags;