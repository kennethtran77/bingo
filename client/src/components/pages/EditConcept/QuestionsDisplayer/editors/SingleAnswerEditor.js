import React from 'react';
import InputOptions from '../../../../widgets/InputOptions';

import Latex from 'react-latex-next';

import Select from 'react-select';

import selectStyles from '../../../../selectStyles.js';

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
        label: <Latex>{option}</Latex>
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
                <Select
                    options={options}
                    isSearchable={false}
                    value={{
                        value: input.answer[0],
                        label: !input.answer.length ? '...' : <Latex>{input.answer[0]}</Latex>
                    }}
                    onChange={(value, action) => {
                        if (action.action === 'select-option') {
                            setInput(prevState => ({ ...prevState, answer: [value.value]}))
                        }
                    }}
                    styles={selectStyles}
                />
            </label>
        </>
    );
}

export default SingleAnswerEditor;