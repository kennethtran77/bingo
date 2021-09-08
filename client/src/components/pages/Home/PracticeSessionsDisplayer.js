import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ReactPaginate from 'react-paginate';

import './PracticeSessionsDisplayer.css';

const PracticeSessionsDisplayer = ({ userId }) => {
    const { practiceSessions, isLoading } = useSelector(state => state.practiceSlice);

    // Pagination
    const [page, setPage] = useState(0);

    const sessionsPerPage = 10;
    const pagesVisited = page * sessionsPerPage;
    const pageCount = Math.ceil(practiceSessions.length / sessionsPerPage);
    const slicedPracticeSessions = practiceSessions.slice(pagesVisited, pagesVisited + sessionsPerPage);

    const handlePageClick = ({ selected }) => setPage(selected);

    return !userId ? '' : (
        <div className="container" id="practice-sessions-displayer">
            <table>
                <thead>
                    <tr>
                        <th id="score">Score</th>
                        <th id="time-completed">Time Completed</th>
                        <th id="title">Title</th>
                    </tr>
                </thead>
                <tbody>
                { slicedPracticeSessions.length && slicedPracticeSessions.map((practiceSession, id) => {
                    let date = new Date(practiceSession.date);
                    date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                    return (
                        <tr key={id}>
                            <td>{practiceSession.score} / {practiceSession.practiceQuestions.length}</td>
                            <td>{ date }</td>
                            <td>{ practiceSession.title }</td>
                            <Link className="center-flex small-button" to={"/practice/results/" + practiceSession._id}>View</Link>
                        </tr>
                    );
                }) }
                </tbody>
            </table>
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
            { isLoading && 'Loading...' }
        </div>
    );
};

export default PracticeSessionsDisplayer;