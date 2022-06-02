import React from 'react';
import InputOptions from '../../../../widgets/InputOptions';

import Latex from 'react-latex-next';

import Dropdown from '../../../../widgets/Dropdown';

const SingleAnswerEditor = ({ input, setInput, handleEditOption }) => {
    const handleAddOption = option => setInput(prevInput => {
        const newOptions = [ ...prevInput.options, option ];

        // Make sure answer is not empty when options is not empty
        return {
            ...prevInput,
            options: newOptions,
            answer: prevInput.answer.length ? prevInput.answer : [newOptions[0]]
        }
    })

    const handleRemoveOption = option => setInput(prevInput => {
        // Remove options and answer
        const newOptions = prevInput.options.filter(t => t !== option);
        const newAnswer = prevInput.answer.filter(t => t !== option);

        // Make sure answer is not empty when options is not empty
        const defaultAnswer = newOptions.length ? [newOptions[0]] : [];

        return {
            ...prevInput,
            options: newOptions,
            answer: newAnswer.length ? newAnswer : defaultAnswer
        };
    });

    const options = input.options.map(option => ({
        value: option,
        display: <Latex>{option}</Latex>
    }));

    return (
        <>
            <label>
                Options
                <InputOptions
                    options={input.options}
                    addOption={handleAddOption}
                    removeOption={handleRemoveOption}
                    editOption={handleEditOption}
                    placeholder={"Enter a unique option"}
                />
            </label>
            <label>
                Answer
                <Dropdown
                    items={options}
                    currItem={{
                        value: input.answer[0],
                        display: !input.answer.length ? '...' : <Latex>{input.answer[0]}</Latex>
                    }}
                    onChange={newItem => setInput(prevState => ({ ...prevState, answer: [newItem.value]} ))}
                />
            </label>
        </>
    );
}

export default SingleAnswerEditor;