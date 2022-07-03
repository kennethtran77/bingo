import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { deleteComment, updateComment, likeComment, dislikeComment, createComment } from '../../../actions/comments';

import './Comment.css';

import LikeDislike from '../../widgets/LikeDislike';
import ConfirmDelete from '../../widgets/ConfirmDelete';
import AccordionButton from '../../widgets/AccordionButton';
import Button from '../../widgets/Button';

const Comment = ({ comment, userId, concept, replies, replyTo, replyToAuthor }) => {
    const { users } = useSelector(state => state.usersSlice);
    const author = users.find(u => u._id === comment.author);

    // mode values: 'delete', 'edit', 'reply', 'none'
    const [mode, setMode] = useState('none');
    const [input, setInput] = useState('');
    const [repliesOpen, setRepliesOpen] = useState(false);

    const dispatch = useDispatch();

    const handleChange = e => {
        e.preventDefault();
        setInput(e.target.value);
    };

    const handleUpdate = e => {
        e.preventDefault();

        if (!input.length || comment.disabled)
            return;

        dispatch(updateComment(concept, comment._id, { text: input }));
        clearInputSetMode('none');
    };

    const handleDelete = e => {
        e.preventDefault();
        dispatch(deleteComment(concept, comment._id));
        clearInputSetMode('none');
    }

    const handleCreateReply = e => {
        e.preventDefault();

        if (!input.length || comment.disabled)
            return;

        const newComment = {
            concept: concept._id,
            text: input,
            replyTo: comment._id,
            rootComment: comment.rootComment
        };

        dispatch(createComment(concept, newComment));
        clearInputSetMode('none');
    }

    const clearInputSetMode = newMode => {
        if (comment.deleted)
            return;

        setInput('');
        setMode(newMode);
    }

    const renderOptions = () => {
        switch (mode) {
            case 'edit':
                return (
                    <>
                        <Button disabled={!input.length} tooltip={!input.length ? 'Please enter a reply' : null} onClick={handleUpdate} text="Save"/>
                        <Button onClick={() => clearInputSetMode('none')} text="Cancel"/>
                    </>
                );
            case 'reply':
                return (
                    <>
                        <Button disabled={!input.length} tooltip={!input.length ? 'Please enter a reply' : null} onClick={handleCreateReply} text="Submit"/>
                        <Button onClick={() => clearInputSetMode('none')} text="Cancel"/>
                    </>
                );
            default:
                return (
                    <>
                        <Button disabled={comment.deleted} onClick={() => clearInputSetMode('reply')} text="Reply"/>
                        { userId === comment.author ?
                            <>
                            <Button disabled={comment.deleted} onClick={() => clearInputSetMode('edit')} text="Edit"/>
                            <Button disabled={comment.deleted} onClick={() => clearInputSetMode('delete')} text="Delete"/>
                            </>
                        : null }
                    </>
                );
        }
    };

    return mode === 'delete' ? <ConfirmDelete title={'this comment'} undo={() => clearInputSetMode('none')} confirm={handleDelete} /> : (
        <div className="comment" id={comment._id}>
            <div className="space-between">
                <span><strong>{author.username}</strong></span>
                <span>
                    {comment.createdAt !== comment.editedAt ? <span className="h-margin"><i>(Edited)</i></span> : null}
                    <span>{new Date(comment.editedAt).toDateString()}</span>
                </span>
            </div>
            { mode === 'edit' ? 
                <textarea
                    placeholder={comment.text}
                    value={input}
                    onChange={handleChange}
                /> : <p style={{ fontStyle: comment.deleted ? 'italic' : 'normal' }}>{replyTo && <a className="coloured-link" href={`#${replyTo._id}`}>{`@${replyToAuthor.username}`}</a> } {comment.text}</p> }
            { mode === 'reply' && <textarea placeholder="Enter a reply" value={input} onChange={handleChange}/> }
            <div className="space-between">
                <LikeDislike
                    userId={userId}
                    likes={comment.likes}
                    dislikes={comment.dislikes}
                    like={() => dispatch(likeComment(concept._id, comment._id))}
                    dislike={() => dispatch(dislikeComment(concept._id, comment._id))}
                    disabled={comment.deleted}
                />
                <div className="flex gap">{renderOptions()}</div>
            </div>
            { (replies && replies.length > 0) ?
            <>
            <span className="left-flex gap">{ replies.length === 1 ? '1 reply' : `${replies.length} replies` } <AccordionButton open={repliesOpen} onClick={() => setRepliesOpen(prev => !prev)} tooltip={repliesOpen ? 'Hide Replies' : 'Show Replies'} /></span>
            <hr />
                { repliesOpen && 
                <ul style={{ listStyleType: 'none' }}>
                { replies.map((reply) => (
                    <li key={reply._id}>
                        <Comment comment={reply} userId={userId} concept={concept} replyTo={comment} replyToAuthor={author} />
                    </li>
                ))}
                </ul>
                }
            </>
            : <hr/> }
        </div>
    );
};

export default Comment;