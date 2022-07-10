import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { createComment } from '../../../actions/comments';
import Button from '../../widgets/Button';

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
            <Button
                disabled={isValueEmpty}
                tooltip={isValueEmpty ? "Please enter some text before submitting." : ""}
                onClick={handleSubmit}
                text="Submit"
            />
        </>
    );
};

export default CommentBox;