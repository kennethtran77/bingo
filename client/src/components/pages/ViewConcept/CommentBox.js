import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { createComment } from '../../../actions/comments';

const CommentBox = ({ concept }) => {
    const [value, setValue] = useState('');
    const dispatch = useDispatch();

    const isValueEmpty = value.trim().length === 0;

    const handleChange = e => {
        setValue(e.target.value);
    }

    const handleSubmit = e => {
        e.preventDefault();

        const newComment = {
            concept: concept._id,
            text: value,
            replyTo: null,
            rootComment: null
        };

        dispatch(createComment(concept, newComment));
        setValue('');
    }

    return (
        <>
            <textarea
                placeholder="Add a new comment"
                value={value}
                onChange={handleChange}>
                
                </textarea>
            <button
                className="small-button"
                disabled={isValueEmpty}
                title={isValueEmpty ? "Please enter some text before submitting." : ""}
                onClick={handleSubmit}
            >
                Submit
            </button>
        </>
    );
};

export default CommentBox;