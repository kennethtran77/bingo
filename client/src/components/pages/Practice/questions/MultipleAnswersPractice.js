import React from 'react';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

import { correctColour, incorrectColour } from '../../../../util';

const MultipleAnswersPractice = ({ question, showCorrectAnswer = false, disabled = false, input, setInput }) => {

    const handleTick = option => {
        if (input.includes(option)) {
            // Remove option as answer
            setInput(input.filter(item => item !== option));
        } else {
            // Add option as answer
            setInput([...input, option]);
        }
    }

    return (
        <ul className="remove-bullet">
            { question.options.map((option, optionIndex) => {
                let itemStyles = {};
                const isCorrect = input.includes(option) && question.answer.includes(option);

                if (showCorrectAnswer) {
                    itemStyles.borderColor = isCorrect ? correctColour : incorrectColour;
                    itemStyles.borderStyle = 'solid';
                    itemStyles.borderWidth = '2px';
                }

                return (
                    <li key={optionIndex} className="container secondary" style={itemStyles}>
                        <input
                            type="checkbox"
                            value={option}
                            disabled={disabled}
                            checked={input.includes(option)}
                            onChange={() => handleTick(option)}
                        />
                        <label><Latex>{option}</Latex></label>
                    </li>
                )
            }) }
        </ul>
    );
}

export default MultipleAnswersPractice;