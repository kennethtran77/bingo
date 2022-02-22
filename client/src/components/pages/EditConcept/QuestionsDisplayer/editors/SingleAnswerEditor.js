import React, { useEffect } from 'react';
import InputOptions from '../../../../widgets/InputOptions';

import Latex from 'react-latex-next';

import Select from 'react-select';

import selectStyles from '../../../../selectStyles.js';

const SingleAnswerEditor = ({ input, setInput, handleEditOption }) => {
    useEffect(() => {
        // apply constraints on inputs
        setInput(prevInput => {
            let newInput = { ...prevInput };

            // Force answer to be a length one array if it isn't already
            if (prevInput.answer.length > 1) {
                newInput.answer = [prevInput.answer[0]];
            }

            // Force answer to be a subset of options
            if (!prevInput.options.includes(prevInput.answer[0])) {
                newInput.answer = prevInput.options.length ? [prevInput.options[0]] : [];
            }

            return newInput;
        });
    }, [setInput]);

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