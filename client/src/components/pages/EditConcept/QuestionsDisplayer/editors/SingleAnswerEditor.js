import React, { useEffect } from 'react';
import InputOptions from '../../../../widgets/InputOptions';

import Latex from 'react-latex-next';

import Select from 'react-select';

import selectStyles from '../../../../selectStyles.js';

const SingleAnswerEditor = ({ input, setInput, handleEditOption }) => {
    useEffect(() => {
        // Force answer to be a length one array if it isn't already
        if (input.answer.length > 1) {
            setInput(prevState => ({ ...prevState, answer: [input.answer[0]] }));
        // Force answer to be a subset of options
        } else if (!input.options.includes(input.answer[0])) {
            setInput(prevState => ({ ...prevState, answer: input.options.length ? [input.options[0]] : [] }));
        }
    }, [input.answer.length, input.options, setInput]);

    const handleAddOption = option => setInput(prevState => {
        const newOptions = [ ...prevState.options, option ];

        // Make sure answer is not empty when options is not empty
        return {
            ...prevState,
            options: newOptions,
            answer: prevState.answer.length ? prevState.answer : [newOptions[0]]
        }
    })

    const handleRemoveOption = option => setInput(prevState => {
        // Remove options and answer
        const newOptions = prevState.options.filter(t => t !== option);
        const newAnswer = prevState.answer.filter(t => t !== option);

        // Make sure answer is not empty when options is not empty
        const defaultAnswer = newOptions.length ? [newOptions[0]] : [];

        return {
            ...prevState,
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