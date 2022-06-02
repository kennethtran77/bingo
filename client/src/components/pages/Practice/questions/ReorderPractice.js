import React from 'react';

import Reorder from '../../../widgets/Reorder';

import { correctColour, incorrectColour } from '../../../../util';

const ReorderPractice = ({ question, showCorrectAnswer = false, disabled = false, input, setInput }) => {
    let itemStyles;
    const inputOrderingIsCorrect = question.answer.some(ordering => JSON.stringify(ordering) === JSON.stringify(input));

    if (showCorrectAnswer) {
        itemStyles = Array(input.length).fill({
            borderColor: inputOrderingIsCorrect ? correctColour : incorrectColour,
            borderStyle: 'solid',
            borderWidth: '2px'
        });
    } else {
        itemStyles = Array(input.length).fill({});
    }

    return (
        <>
            <Reorder
                title={question._id}
                disabled={disabled}
                styles={itemStyles}
                order={input}
                setOrder={setInput}
            />
        </>
    );
}

export default ReorderPractice;