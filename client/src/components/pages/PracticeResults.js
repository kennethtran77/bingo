import React, { useState, useEffect } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';

import PracticeQuestionVisualizer from './Practice/PracticeQuestionVisualizer';

import { correctColour, incorrectColour } from '../../util';

const PracticeResults = ({ userId }) => {
    const [toRender, setToRender] = useState('Loading...');

    const { sessionId } = useParams();
    const { practiceSessions, isLoading } = useSelector(state => state.practiceSlice);

    const practiceSession = practiceSessions.find(s => s._id === sessionId);

    // Load the practice session results
    useEffect(() => {
        // If the practice session hasn't loaded yet
        if (!practiceSession && isLoading) {
            setToRender('Loading...');
            return;
        }

        // If we finished loading and couldn't find the practice session, redirect to home
        if (!practiceSession && !isLoading) {
            setToRender(<Redirect to="/"/>);
            return;
        }
    }, [userId, isLoading, practiceSession]);

    useEffect(() => {
        if (practiceSession) {
            // const questionHasChanged = practiceSession.practiceQuestions.map(question => {

            // });
            const questionHasChanged = false;

            setToRender(
                <>
                    <div className="container">
                        <h3>Score: { practiceSession.score } / { practiceSession.practiceQuestions.length }</h3>
                        <div className="left-flex">
                            <Link className="small-button" to="/">Go Home</Link>
                        </div>
                    </div>
                    { questionHasChanged && <h2>Alert: This question has been modified after this practice session occured.</h2>}
                    <table style={{
                        tableLayout: 'fixed',
                        width: '100%'
                    }}>
                        <thead>
                            <tr>
                                <th>Your Answers</th>
                                <th>Correct Answers</th>
                            </tr>
                        </thead>
                        { practiceSession.practiceQuestions.map((question, index) => (
                            <tbody key={index}>
                                <tr>
                                    <td>
                                        <PracticeQuestionVisualizer
                                            question={question}
                                            index={index}
                                            disabled={true}
                                            styles={{
                                                correctAnswer: {
                                                    backgroundColor: correctColour
                                                },
                                                incorrectAnswer: {
                                                    backgroundColor: incorrectColour
                                                }
                                            }}
                                            input={question.input}
                                        />
                                    </td>
                                    <td>
                                        <PracticeQuestionVisualizer
                                            question={question}
                                            index={index}
                                            disabled={true}
                                            input={question.answer}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </>
            );
        }
    }, [practiceSession]);

    return toRender;
};

export default PracticeResults;