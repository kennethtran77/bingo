import React, { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { updateCollection } from '../../../actions/collections';

import Tooltip from '../../widgets/Tooltip';
import InputTags from '../../widgets/InputTags';
import LoadingSpinner from '../../widgets/LoadingSpinner';
import Button from '../../widgets/Button';

const CollectionEditor = ({ collection, isLoading }) => {
    const [input, setInput] = useState({ title: '', tags: [] });
    const [saveMessage, setSaveMessage] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if (collection) {
            setInput(collection);
        }
    }, [collection]);

    const handleSubmit = () => {
        setSaveMessage('Saving...');
        dispatch(updateCollection(collection._id, { ...collection, title: input.title, tags: input.tags }))
        .then(res => {
            if (res.data.message) {
                setSaveMessage(res.data.message);
            }
        });
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
                <div className="flex">
                    <Tooltip
                        showOnClick={true}
                        content={saveMessage}
                        direction={"right"}
                    >
                        <Button
                            text="Save"
                            onClick={handleSubmit}
                            background
                            vMargin
                            stopPropogation={false}
                        />
                    </Tooltip>
                </div>
            </form>
            { isLoading && <LoadingSpinner /> }
        </div>
    );
};

export default CollectionEditor;