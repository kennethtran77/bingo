import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../widgets/LoadingSpinner';

import Paginate from '../../widgets/Paginate';

import Comment from './Comment';
import CommentBox from './CommentBox';

const Comments = ({ concept, userId }) => {
    const { comments, isLoading, message } = useSelector(state => state.commentsSlice);
    const [conceptComments, setConceptComments] = useState([]);

    // load concept comments into state once comments fetched from store
    useEffect(() => {
        if (comments) {
            setConceptComments(comments.filter(comment => comment.concept === concept._id));
        }
    }, [comments, concept._id]);

    // Pagination
    const [commentsToDisplay, setCommentsToDisplay] = useState([]);

    return (
        <>
            <h3>Comments ({conceptComments.length})</h3>
            <CommentBox concept={concept} />
            { message.content && <p style={{color: message.colour}} id="message">{message.content}</p> }
            <ul className="remove-bullet">
                { commentsToDisplay.length ? commentsToDisplay.map((comment) => (
                    <li key={comment._id}>
                        <Comment comment={comment} userId={userId} concept={concept} />
                    </li>
                )) :
                    <span>No comments yet.</span>
                }
            </ul>
            { isLoading && <LoadingSpinner /> }
            <Paginate 
                items={conceptComments}
                itemsPerPage={10}
                setItemsToDisplay={setCommentsToDisplay}
            />
        </>
    );
};

export default Comments;