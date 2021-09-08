import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import QuestionVisualizer from './QuestionVisualizer';

import { createQuestion, deleteQuestion } from '../../../../actions/questions';

const QuestionsDisplayer = ({ concept }) => {
    const dispatch = useDispatch();
    const { questions, isLoading } = useSelector(state => state.questionsSlice);

    const conceptQuestions = questions.filter(question => question.concept === concept._id);

    const handleClick = e => {
        e.preventDefault();

        const newQuestion = {
            concept: concept._id,
            type: 'FillInTheBlank',
            title: 'New Question',
            text: "It's so quiet here...",
            answer: [],
            options: [],
            textMathjaxEnabled: false,
            optionsMathjaxEnabled: false,
        };

        // dispatch the action to invoke the API
        dispatch(createQuestion(concept, newQuestion));
    }

    const remove = question => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            dispatch(deleteQuestion(concept, question._id));
        };
    }

    return (
        <div>
            <h2>Questions</h2>
            <div>
                <ul className="remove-bullet">
                    { conceptQuestions && conceptQuestions.map((question, index) => (
                        <li key={index}>
                            <QuestionVisualizer
                                concept={concept}
                                question={question}
                                remove={() => remove(question)}
                            />
                        </li>
                    )) }
                </ul>
                { isLoading && 'Loading...' }
                <button onClick={handleClick} className="plus"></button>
            </div>
        </div>
    );
};

export default QuestionsDisplayer;