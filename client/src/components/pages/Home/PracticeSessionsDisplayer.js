import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './PracticeSessionsDisplayer.css';
import Paginate from '../../widgets/Paginate';

const PracticeSessionsDisplayer = ({ userId }) => {
    const { practiceSessions, isLoading } = useSelector(state => state.practiceSlice);

    // Pagination
    const [practiceSessionsToDisplay, setPracticeSessionsToDisplay] = useState(practiceSessions);

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
                { practiceSessionsToDisplay.map((practiceSession, id) => {
                    let date = new Date(practiceSession.date);
                    date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                    return (
                        <tr key={id}>
                        <   td>{practiceSession.score} / {practiceSession.practiceQuestions.length}</td>
                            <td>{ date }</td>
                            <td>{ practiceSession.title }</td>
                            <Link className="center-flex small-button v-margin" to={"/practice/results/" + practiceSession._id}>View</Link>
                        </tr>
                    );
                }) }
                </tbody>
            </table>
            <Paginate
                items={practiceSessions}
                itemsPerPage={10}
                setItemsToDisplay={setPracticeSessionsToDisplay}
            />
            { isLoading && 'Loading...' }
        </div>
    );
};

export default PracticeSessionsDisplayer;