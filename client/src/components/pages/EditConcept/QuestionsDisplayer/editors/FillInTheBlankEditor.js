import React, { useEffect } from 'react';
import InputCloze from '../../../../widgets/InputCloze';
import NewButton from '../../../../widgets/NewButton';

const FillInTheBlankEditor = ({ input, setInput }) => {
    // Ensure that input.answer always contains at least one input field
    useEffect(() => {
        if (!input.answer.length) {
            setInput(prevInput => ({ ...prevInput, answer: [''] }));
        }
    }, [input, setInput]);

    const addBlankAtEnd = () => {
        setInput(prevInput => ({
            ...prevInput,
            answer: prevInput.answer.concat([[], ''])
        }));
    };

    return (
        <>
            <label>
                Cloze Field
                <NewButton onClick={addBlankAtEnd} ariaLabel="Add Blank At End" tooltip="Add Blank At End" />
                <InputCloze
                    input={input}
                    setInput={setInput}
                />
            </label>
        </>
    );
}

export default FillInTheBlankEditor;