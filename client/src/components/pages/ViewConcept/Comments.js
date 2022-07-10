import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../../widgets/LoadingSpinner';

import Paginate from '../../widgets/Paginate';

import Comment from './Comment';
import CommentBox from './CommentBox';

const Comments = ({ concept, userId }) => {
    const { comments, isLoading, message } = useSelector(state => state.commentsSlice);
    const conceptComments = useMemo(() => comments.filter(comment => comment.concept === concept._id), [concept._id, comments]);
    const conceptCommentsNoReplies = useMemo(() => conceptComments.filter(comment => !comment.replyTo), [conceptComments]);

    // Pagination
    const [commentsToDisplay, setCommentsToDisplay] = useState([]);

    return (
        <>
            <h3>Comments ({conceptComments.length})</h3>
            <CommentBox concept={concept} />
            { message.content && <p style={{color: message.colour}} id="message">{message.content}</p> }
            <ul className="remove-bullet">
                { commentsToDisplay.length ? commentsToDisplay.map((comment) => {
                    const commentReplies = conceptComments.filter(c => c.rootComment === comment._id && c._id !== comment._id);

                    return (
                        <li key={comment._id} tabIndex={0} >
                            <Comment comment={comment} userId={userId} concept={concept} replies={commentReplies} />
                        </li>
                    );
                }) :
                    <span>No comments yet.</span>
                }
            </ul>
            { isLoading && <LoadingSpinner /> }
            <Paginate 
                items={conceptCommentsNoReplies}
                itemsPerPage={10}
                setItemsToDisplay={setCommentsToDisplay}
            />
        </>
    );
};

export default Comments;