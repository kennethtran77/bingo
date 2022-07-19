import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

import { useDispatch, useSelector } from 'react-redux';

import PracticeQuestion from './Practice/PracticeQuestion';

import Button from '../widgets/Button';

import { fetchPracticeQuestionsChanged } from '../../actions/practice';

import { REORDER } from '../../util';
import LoadingScreen from '../widgets/LoadingScreen';

const PracticeResults = ({ userId }) => {
    const { sessionId } = useParams();

    const dispatch = useDispatch();

    // load sessions from store
    const { practiceSessions, isLoading } = useSelector(state => state.practiceSlice);

    // boolean array representing whether a question was modified since the practice session occurred
    const [questionsChanged, setQuestionsChanged] = useState(null);

    const practiceSession = practiceSessions.find(s => s._id === sessionId);

    // check if any of the questions have changed since this session
    useEffect(() => {
        if (practiceSession) {
            const fetchQuestionsChanged = async () => {
                const changed = await dispatch(fetchPracticeQuestionsChanged(practiceSession._id));
                setQuestionsChanged(changed);
            }

            fetchQuestionsChanged();
        }
    }, [practiceSession]);

    // If the practice session hasn't loaded yet, display loading spinner
    if ((!practiceSession && isLoading) || (practiceSession && !questionsChanged))
        return <LoadingScreen />;
    
    // If we finished loading and couldn't find the practice session, redirect to home
    if (!practiceSession && !isLoading)
        return <Navigate to="/"/>;

    return (
        <>
            <div className="container">
                <h3>Score: { practiceSession.score } / { practiceSession.practiceQuestions.length }</h3>
                <div className="left-flex">
                    <Button link="/" text="Go Home" background />
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
                        <tbody key={index} >
                            { questionsChanged[index] && (
                                <tr>
                                    <td colSpan='2'>
                                        <div className="container secondary flex gap">
                                            <strong><WarningIcon /></strong>
                                            The following question was modified after this practice session occured. Displaying the original version.
                                        </div>
                                    </td>
                                </tr>
                            )}
                            { (question.type === REORDER && question.answer.length > 1) && (
                                <tr>
                                    <td colSpan='2'>
                                        <div className="container secondary flex gap">
                                            <strong><InfoIcon /></strong>
                                            The following question has multiple correct answers.
                                        </div>
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td>
                                    <PracticeQuestion
                                        question={question}
                                        index={index}
                                        disabled={true}
                                        showCorrectAnswer={true}
                                        input={question.input}
                                    />
                                </td>
                                <td>
                                    <PracticeQuestion
                                        question={question}
                                        index={index}
                                        disabled={true}
                                        showCorrectAnswer={false}
                                        input={question.type === REORDER ? question.answer[0] : question.answer}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    )
                })}
            </table>
        </>
    );
};

export default PracticeResults;