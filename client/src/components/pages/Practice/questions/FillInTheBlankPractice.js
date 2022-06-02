import React from 'react';

import style from './FillInTheBlankPractice.module.css';

import { correctColour, incorrectColour } from '../../../../util';

const FillInTheBlankPractice = ({ question, showCorrectAnswer = false, disabled = false, input, setInput }) => {
    return (
        <>
            { question.answer.map((answer, answerIndex) => {
                let itemStyles = {};
                const isInputFieldCorrect = question.answer[answerIndex].includes(input[answerIndex]);

                if (showCorrectAnswer) {
                    itemStyles.color = isInputFieldCorrect ? correctColour : incorrectColour;
                }

                return (
                    // Make a blank
                    Array.isArray(answer) ? (
                        <input
                            type="text"
                            className={style.blank}
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
                        <span key={answerIndex} style={{ wordBreak: 'break-all' }}>{ answer }</span>
                    )
                )
            } )}
        </>
    );
}

export default FillInTheBlankPractice;