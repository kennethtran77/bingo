import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import PracticeQuestion from './PracticeQuestion';
import { processSession } from '../../../actions/practice';
import Button from '../../widgets/Button';

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
    const navigate = useNavigate();

    const handleSubmit = useCallback(() => {
        if (!questions)
            return;

        // make an array of practice question responses

        const inputs = input.map((input, index) => ({
            conceptId: questions[index].concept,
            questionId: questions[index]._id,
            input: input,
            type: questions[index].type,
            title: questions[index].title,
            text: questions[index].text,
            options: questions[index].options,
            answer: questions[index].answer
        }));

        dispatch(processSession(title, inputs, navigate));
    }, [dispatch, questions, title, navigate, input]);

    return (
        <>
            <h1>Practice: {title}</h1>
            <ul className="remove-bullet">
                { questions.map((question, index) => (
                    <li key={index}>
                        <PracticeQuestion
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
            <Button onClick={handleSubmit} text="Submit" background />
        </>
    );
}

export default Practice;