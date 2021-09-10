import React from 'react';
import { correctColour, incorrectColour } from '../../../../util';

import './FillInTheBlankPractice.css';

const FillInTheBlankPractice = ({ question, componentType, input, setInput }) => {
    return (
        <>
            { question.answer.map((answer, answerIndex) => {
                let styles = {};

                if (componentType === 'resultsUserInput') {
                    if (question.answer[answerIndex].includes(input[answerIndex])) {
                        // correct
                        styles.color = correctColour;
                    } else {
                        // incorrect
                        styles.color = incorrectColour;
                    }
                }

                return (
                    // Make a blank
                    Array.isArray(answer) ? (
                        <input
                            type="text"
                            className="blank"
                            style={styles}
                            key={answerIndex}
                            disabled={componentType !== 'practice'}
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