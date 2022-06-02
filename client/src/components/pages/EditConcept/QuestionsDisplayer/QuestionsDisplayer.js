import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import QuestionVisualizer from './QuestionVisualizer';

import { createQuestion, deleteQuestion } from '../../../../actions/questions';
import LoadingSpinner from '../../../widgets/LoadingSpinner';

import NewButton from '../../../widgets/NewButton';

const QuestionsDisplayer = ({ concept }) => {
    const dispatch = useDispatch();
    const { questions, isLoading } = useSelector(state => state.questionsSlice);

    const conceptQuestions = questions.filter(question => question.concept === concept._id);

    const handleClick = e => {
        e.preventDefault();

        // dispatch the action to invoke the API
        dispatch(createQuestion(concept));
    }

    const remove = question => dispatch(deleteQuestion(concept, question._id));

    return (
        <div>
            <h2>Questions</h2>
            <div>
                <ul className="remove-bullet">
                    { conceptQuestions && conceptQuestions.map((question) => (
                        <li key={question._id}>
                            <QuestionVisualizer
                                concept={concept}
                                question={question}
                                remove={() => remove(question)}
                            />
                        </li>
                    )) }
                </ul>
                { isLoading && <LoadingSpinner/> }
                <NewButton onClick={handleClick} aria-label="Create New Question" tooltip="Create New Question" />
            </div>
        </div>
    );
};

export default QuestionsDisplayer;