import React from 'react';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

import FillInTheBlankPractice from './questions/FillInTheBlankPractice';
import MultipleAnswersPractice from './questions/MultipleAnswersPractice';
import ReorderPractice from './questions/ReorderPractice';
import SingleAnswerPractice from './questions/SingleAnswerPractice';

const PracticeQuestionVisualizer = ({ question, showCorrectAnswer, disabled, input, setInput, style = {} }) => {
    const fetchQuestion = type => {
        switch (type) {
            case 'FillInTheBlank':
                return <FillInTheBlankPractice
                    question={question}
                    showCorrectAnswer={showCorrectAnswer}
                    disabled={disabled}
                    input={input}
                    setInput={setInput}
                />;
            case 'MultipleAnswers':
                return <MultipleAnswersPractice
                    question={question}
                    showCorrectAnswer={showCorrectAnswer}
                    disabled={disabled}
                    input={input}
                    setInput={setInput}
                />;
            case 'Reorder':
                return <ReorderPractice
                    question={question}
                    showCorrectAnswer={showCorrectAnswer}
                    disabled={disabled}
                    input={input}
                    setInput={setInput}
                />;
            case 'SingleAnswer':
                return <SingleAnswerPractice
                    question={question}
                    showCorrectAnswer={showCorrectAnswer}
                    disabled={disabled}
                    input={input}
                    setInput={setInput}
                />;
            default:
                return 'Error';
        }
    }

    return (
        <div className="container" style={style}>
            <h2>{question.title}</h2>
            <p><Latex>{question.text}</Latex></p>
            { fetchQuestion(question.type) }
        </div>
    );
}

export default PracticeQuestionVisualizer;