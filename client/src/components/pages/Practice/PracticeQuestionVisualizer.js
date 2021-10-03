import React from 'react';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

import FillInTheBlankPractice from './questions/FillInTheBlankPractice';
import MultipleAnswersPractice from './questions/MultipleAnswersPractice';
import ReorderPractice from './questions/ReorderPractice';
import SingleAnswerPractice from './questions/SingleAnswerPractice';

const PracticeQuestionVisualizer = ({ question, disabled, styles, input, setInput }) => {
    const fetchQuestion = type => {
        switch (type) {
            case 'FillInTheBlank':
                return <FillInTheBlankPractice
                    question={question}
                    disabled={disabled}
                    styles={styles}
                    input={input}
                    setInput={setInput}
                />;
            case 'MultipleAnswers':
                return <MultipleAnswersPractice
                    question={question}
                    disabled={disabled}
                    styles={styles}
                    input={input}
                    setInput={setInput}
                />;
            case 'Reorder':
                return <ReorderPractice
                    question={question}
                    disabled={disabled}
                    styles={styles}
                    input={input}
                    setInput={setInput}
                />;
            case 'SingleAnswer':
                return <SingleAnswerPractice
                    question={question}
                    disabled={disabled}
                    styles={styles}
                    input={input}
                    setInput={setInput}
                />;
            default:
                return 'Error';
        }
    }

    return (
        <div className="container">
            <h2>{question.title}</h2>
            <p><Latex>{question.text}</Latex></p>
            { fetchQuestion(question.type) }
        </div>
    );
}

export default PracticeQuestionVisualizer;