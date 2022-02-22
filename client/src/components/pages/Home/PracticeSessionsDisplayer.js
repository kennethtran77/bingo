import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './PracticeSessionsDisplayer.css';
import Paginate from '../../widgets/Paginate';
import LoadingSpinner from '../../widgets/LoadingSpinner';

const PracticeSessionsDisplayer = ({ userId }) => {
    const { practiceSessions, isLoading } = useSelector(state => state.practiceSlice);

    // Pagination
    const [practiceSessionsToDisplay, setPracticeSessionsToDisplay] = useState(practiceSessions);

    return !userId ? <LoadingSpinner /> : (
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
                { practiceSessionsToDisplay.map((practiceSession) => {
                    let date = new Date(practiceSession.date);
                    date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                    return (
                        <tr key={practiceSession._id}>
                            <td>{practiceSession.score} / {practiceSession.practiceQuestions.length}</td>
                            <td>{ date }</td>
                            <td>{ practiceSession.title }</td>
                            <td><Link className="center-flex small-button v-margin" to={"/practice/results/" + practiceSession._id}>View</Link></td>
                        </tr>
                    );
                })}
                { practiceSessionsToDisplay.length === 0 && (
                    <tr key={0}>
                        <td colSpan="3" className="padding">You have not completed any practice sessions.</td>
                    </tr>
                ) }
                </tbody>
            </table>
            <Paginate
                items={practiceSessions}
                itemsPerPage={10}
                setItemsToDisplay={setPracticeSessionsToDisplay}
            />
            { isLoading && <LoadingSpinner /> }
        </div>
    );
};

export default PracticeSessionsDisplayer;