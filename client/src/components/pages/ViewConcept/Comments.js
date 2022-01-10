import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import ReactPaginate from 'react-paginate';

import Comment from './Comment';
import CommentBox from './CommentBox';

const Comments = ({ concept, userId }) => {
    const { comments, isLoading, message } = useSelector(state => state.commentsSlice);

    const conceptComments = comments.filter(comment => comment.concept === concept._id);

    // Pagination
    const [page, setPage] = useState(0);

    const commentsPerPage = 10;
    const pagesVisited = page * commentsPerPage;
    const pageCount = Math.ceil(conceptComments.length / commentsPerPage);
    const slicedComments = conceptComments.slice(pagesVisited, pagesVisited + commentsPerPage);

    const handlePageClick = ({ selected }) => setPage(selected);

    return (
        <>
            <h3>Comments ({conceptComments.length})</h3>
            <CommentBox concept={concept} />
            { message.content && <p style={{color: message.colour}} id="message">{message.content}</p> }
            <ul className="remove-bullet">
                { slicedComments.length ? slicedComments.map((comment, id) => (
                    <li key={id}>
                        <Comment comment={comment} userId={userId} concept={concept} />
                    </li>
                )) :
                    <span>No comments yet.</span>
                }
            </ul>
            { isLoading && 'Loading...' }
            <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                pageCount={pageCount}
                onPageChange={handlePageClick}
                containerClassName={"pagination-button"}
                previousLinkClassName={"previous-button"}
                nextLinkClassName={"next-button"}
                disabledClassName={"pagination-disabled"}
                activeClassName={"pagination-active"}
            />
        </>
    );
};

export default Comments;