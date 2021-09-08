import React from 'react';

import FillInTheBlankPractice from './questions/FillInTheBlankPractice';
import MultipleAnswersPractice from './questions/MultipleAnswersPractice';
import ReorderPractice from './questions/ReorderPractice';
import SingleAnswerPractice from './questions/SingleAnswerPractice';

import Math from '../../widgets/Math';

const PracticeVisualizer = ({ question, index, componentType, input, setInput }) => {
    const fetchQuestion = type => {
        switch (type) {
            case 'FillInTheBlank':
                return <FillInTheBlankPractice
                    question={question}
                    index={index}
                    componentType={componentType}
                    input={input}
                    setInput={setInput}
                />;
            case 'MultipleAnswers':
                return <MultipleAnswersPractice
                    question={question}
                    index={index}
                    componentType={componentType}
                    input={input}
                    setInput={setInput}
                />;
            case 'Reorder':
                return <ReorderPractice
                    question={question}
                    index={index}
                    componentType={componentType}
                    input={input}
                    setInput={setInput}
                />;
            case 'SingleAnswer':
                return <SingleAnswerPractice
                    question={question}
                    index={index}
                    componentType={componentType}
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
            <p><Math text={question.text} enabled={question.textMathjaxEnabled} /></p>
            { fetchQuestion(question.type) }
        </div>
    );
}

export default PracticeVisualizer;