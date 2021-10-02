import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import PracticeQuestionVisualizer from './PracticeQuestionVisualizer';
import { processSession } from '../../../actions/practice';

const Practice = ({ questions, title }) => {
    // State hooks
    let [input, setInput] = useState(questions.map(question => {
        switch (question.type) {
            case 'FillInTheBlank':
                return question.answer.map(answer => Array.isArray(answer) ? '' : null);
            case 'SingleAnswer':
                return [];
            case 'MultipleAnswers':
                return [];
            case 'Reorder':
                return question.options;
            default:
                return [];
        }
    }));

    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = useCallback(() => {
        if (!questions)
            return;

        const inputs = input.map((input, index) => ({
            conceptId: questions[index].concept,
            questionId: questions[index]._id,
            input: input,
            type: questions[index].type,
            title: questions[index].title,
            text: questions[index].text,
            options: questions[index].options,
            answer: questions[index].answer,
            textMathjaxEnabled: questions[index].textMathjaxEnabled,
            optionsMathjaxEnabled: questions[index].optionsMathjaxEnabled
        }));

        dispatch(processSession(title, inputs, history));
    }, [dispatch, questions, title, history, input]);

    return (
        <>
            <h1>Practice: {title}</h1>
            <ul className="remove-bullet">
                { questions.map((question, index) => (
                    <li key={index}>
                        <PracticeQuestionVisualizer
                            question={question}
                            disabled={false}
                            input={input[index]}
                            setInput={newField => {
                                setInput(prevInput => {
                                    let newInput = [...prevInput];
                                    newInput[index] = newField;
                                    return newInput;
                                });
                            }}
                        />
                    </li>
                ))}
            </ul>
            <button className="small-button" onClick={handleSubmit}>Submit</button>
        </>
    );
}

export default Practice;