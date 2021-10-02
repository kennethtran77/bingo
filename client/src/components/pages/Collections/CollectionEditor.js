import React, { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { updateCollection } from '../../../actions/collections';

import InputTags from '../../widgets/InputTags';

const CollectionEditor = ({ collection, isLoading }) => {
    const [input, setInput] = useState({ title: '', tags: [] });

    const dispatch = useDispatch();

    useEffect(() => {
        if (collection) {
            setInput(collection);
        }
    }, [collection]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateCollection(collection._id, { ...collection, title: input.title, tags: input.tags }));
    }

    return (
        <div className="editor">
            <h2>Edit Collection</h2>
            <form className="form">
                <label>
                    Title
                    <input
                        className="input"
                        type="text"
                        name="text"
                        autoComplete="off"
                        value={input.title || ''}
                        onChange={e => setInput({ ...input, title: e.target.value })}
                    />
                </label>
                <label>
                    Tags
                    <InputTags
                        className="input"
                        tags={input.tags}
                        addTag={tag => setInput(prevState => ({ ...prevState, tags: [ ...prevState.tags, tag ] })) }
                        removeTag={tag => setInput(prevState => ({ ...prevState, tags: prevState.tags.filter(t => t !== tag)})) }
                        maxLength={30}
                    />
                </label>
                <input className="small-button" type="button" onClick={handleSubmit} value="Save" />
            </form>
            { isLoading && 'Loading...' }
        </div>
    );
};

export default CollectionEditor;