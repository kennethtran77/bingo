import React, { useEffect } from 'react';
import InputCloze from '../../../../widgets/InputCloze';

const FillInTheBlankEditor = ({ input, setInput }) => {
    // Readjust input.options and input.answer whenever switching to FillInTheBlank
    useEffect(() => {
        // Clear input.options array
        setInput(prevState => ({ ...prevState, options: [] }));

        // Make sure input.answer is correct if empty
        if (input.answer.length < 1) {
            setInput(prevState => ({ ...prevState, answer: [''] }));
        }
    }, [input.type, setInput, input.answer]);

    return (
        <>
            <label>
                Cloze Field
                <InputCloze
                    input={input}
                    setInput={setInput}
                />
            </label>
        </>
    );
}

export default FillInTheBlankEditor;