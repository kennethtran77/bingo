import React, { useState, useEffect, useCallback } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

import { useSelector } from 'react-redux';

import PracticeQuestionVisualizer from './Practice/PracticeQuestionVisualizer';

import { correctColour, incorrectColour } from '../../util';

import { fetchPracticeQuestionChanged } from '../../api';

const PracticeResults = ({ userId }) => {
    const [toRender, setToRender] = useState('Loading...');

    const { sessionId } = useParams();
    const { practiceSessions, isLoading } = useSelector(state => state.practiceSlice);

    const [questionsChanged, setQuestionsChanged] = useState(null);

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
        
        fetchQuestionsChanged();
    }, [userId, isLoading, practiceSession]);

    // check if any of the questions have changed since this session
    const fetchQuestionsChanged = useCallback(async () => {
        if (practiceSession) {
            const changed = Array(practiceSession.practiceQuestions.length).fill(false);

            for (let i = 0; i < practiceSession.practiceQuestions.length; i++) {
                let response = await fetchPracticeQuestionChanged(practiceSession._id, practiceSession.practiceQuestions[i].question);
                changed[i] = response.data;
            }

            setQuestionsChanged(changed);
        }
    }, [practiceSession]);

    useEffect(() => {
        if (practiceSession && questionsChanged) {
            setToRender(
                <>
                    <div className="container">
                        <h3>Score: { practiceSession.score } / { practiceSession.practiceQuestions.length }</h3>
                        <div className="left-flex">
                            <Link className="small-button" to="/">Go Home</Link>
                        </div>
                    </div>
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
                        { practiceSession.practiceQuestions.map((question, index) => {
                            return (
                                <tbody key={index}>
                                    { questionsChanged[index] && (
                                        <tr>
                                            <td colspan='2'>
                                                <div className="container secondary"><strong>Alert</strong>: The following question was modified after this practice session occured. Displaying the original version.</div>
                                            </td>
                                        </tr>
                                    )}
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
                            )
                        })}
                    </table>
                </>
            );
        }
    }, [practiceSession, questionsChanged]);

    return toRender;
};

export default PracticeResults;