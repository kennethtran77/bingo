import React from 'react';

import './FillInTheBlankPractice.css';

const FillInTheBlankPractice = ({ question, disabled, styles, input, setInput }) => {
    return (
        <>
            { question.answer.map((answer, answerIndex) => {
                let itemStyles = {};

                if (question.answer[answerIndex].includes(input[answerIndex])) {
                    // correct
                    itemStyles = !styles ? {} : styles.correctAnswer;
                } else {
                    // incorrect
                    itemStyles = !styles ? {} : styles.incorrectAnswer;
                }

                return (
                    // Make a blank
                    Array.isArray(answer) ? (
                        <input
                            type="text"
                            className="blank"
                            style={itemStyles}
                            key={answerIndex}
                            disabled={disabled}
                            value={input[answerIndex] || ''}
                            onChange={e => {
                                // update the parent component state
                                let newInput = [ ...input ];
                                newInput[answerIndex] = e.target.value;
                                setInput(newInput);
                            }}
                        />
                    ) : (
                    // Display the text
                        <span key={answerIndex}>{ answer }</span>
                    )
                )
            } )}
        </>
    );
}

export default FillInTheBlankPractice;