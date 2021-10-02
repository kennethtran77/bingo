import React from 'react';

import Math from '../../../widgets/Math';

const MultipleAnswersPractice = ({ question, disabled, styles, input, setInput }) => {

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

                if (input.includes(option) && question.answer.includes(option)) {
                    // correct
                    itemStyles = !styles ? {} : styles.correctAnswer;
                } else {
                    // incorrect
                    itemStyles = !styles ? {} : styles.incorrectAnswer;
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
                        <label><Math text={option} enabled={question.optionsMathjaxEnabled} /></label>
                    </li>
                )
            }) }
        </ul>
    );
}

export default MultipleAnswersPractice;