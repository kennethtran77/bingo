import React from 'react';
import InputCloze from '../../../../widgets/InputCloze';

const FillInTheBlankEditor = ({ input, setInput }) => {
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