import React from 'react';
import { correctColour, incorrectColour } from '../../../../util';

import Math from '../../../widgets/Math';

const MultipleAnswersPractice = ({ question, componentType, input, setInput }) => {

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
        <ul className="container remove-bullet">
            { question.options.map((option, optionIndex) => {
                let styles = {};

                if (componentType === 'resultsUserInput') {
                    if (input.includes(option) && question.answer.includes(option)) {
                        // correct
                        styles.backgroundColor = correctColour;
                    } else {
                        // incorrect
                        styles.backgroundColor = incorrectColour;
                    }
                }

                return (
                    <li key={optionIndex} className="container" style={styles}>
                        <input
                            type="checkbox"
                            value={option}
                            disabled={componentType !== 'practice'}
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