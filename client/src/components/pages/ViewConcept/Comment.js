import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteComment, updateComment } from '../../../actions/comments';

import ConfirmDelete from '../../widgets/ConfirmDelete';

const Comment = ({ comment, userId, concept }) => {
    const { users } = useSelector(state => state.usersSlice);
    const author = users.find(u => u._id === comment.author);

    const [editMode, setEditMode] = useState(false);
    const [editValue, setEditValue] = useState('');
    const [toDelete, setToDelete] = useState(false);

    const dispatch = useDispatch();

    const handleChange = e => {
        e.preventDefault();
        setEditValue(e.target.value);
    };

    const handleUpdate = e => {
        e.preventDefault();
        dispatch(updateComment(concept, comment._id, { text: editValue }));
        setEditMode(false);
    };

    return toDelete ? <ConfirmDelete title={'this comment'} undo={() => setToDelete(false)} confirm={() => dispatch(deleteComment(concept, comment._id))} /> : (
        <div className="secondary padding v-margin">
            <div className="space-between">
                <span><strong>{author.username}</strong></span>
                <span>
                    {comment.created_at !== comment.updated_at ? <span className="h-margin"><i>(Edited)</i></span> : null}
                    <span>{new Date(comment.updated_at).toDateString()}</span>
                </span>
            </div>
            { !editMode ? <p>{comment.text}</p> : (
                <textarea
                    placeholder={comment.text}
                    value={editValue}
                    onChange={handleChange}
                />
            )}
            { userId === comment.author ? (
                <>
                    <hr />
                        <div className="left-flex">
                        { !editMode ? (
                            <>
                                <span className="link" onClick={() => setEditMode(true)}>Edit</span>
                                <span className="link h-margin" onClick={() => setToDelete(true)}>Delete</span>
                            </>
                        ) : (
                            <>
                                <span className="link" onClick={handleUpdate}>Save</span>
                                <span className="link h-margin" onClick={() => setEditMode(false)}>Cancel</span>
                            </>
                        )}
                        </div>
                </>
            ) : null}
        </div>
    );
};

export default Comment;