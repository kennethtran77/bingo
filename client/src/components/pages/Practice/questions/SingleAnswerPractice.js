import React from 'react';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

import Dropdown from '../../../widgets/Dropdown';
import { correctColour, incorrectColour } from '../../../../util';

const SingleAnswerPractice = ({ question, showCorrectAnswer, disabled, input, setInput }) => {
    const options = question.options.map(option => ({
        value: option,
        display: <Latex>{option}</Latex>
    }));

    let headerStyle = {}

    if (showCorrectAnswer) {
        headerStyle.borderColor = input[0] === question.answer[0] ? correctColour : incorrectColour;
        headerStyle.borderStyle = 'solid';
        headerStyle.borderWidth = '2px';
    }

    return (
        <Dropdown
            items={options}
            currItem={{
                value: input[0],
                display: !input[0] ? '...' : <Latex>{input[0]}</Latex>
            }}
            onChange={newItem => setInput([newItem.value])}
            disabled={disabled}
            headerStyle={headerStyle}
        />
    );
}

export default SingleAnswerPractice;