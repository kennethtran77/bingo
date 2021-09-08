import React, { useState, useEffect } from 'react';
import InputTags from '../../../../widgets/InputTags';
import Math from '../../../../widgets/Math';
import MathjaxOption from '../../../../widgets/MathjaxOption';

import Select from 'react-select';

import selectStyles from '../../../../selectStyles.js';

const SingleAnswerEditor = ({ input, setInput }) => {
    const [mathjaxError, setMathjaxError] = useState('');

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
        label: <Math text={option} enabled={input.optionsMathjaxEnabled} />
    }));

    return (
        <>
            <label>
                Options
                <MathjaxOption
                    enabled={input.optionsMathjaxEnabled}
                    setEnabled={enabled => setInput({ ...input, optionsMathjaxEnabled: enabled})}
                />
                <InputTags
                    tags={input.options}
                    addTag={handleAddOption}
                    removeTag={handleRemoveOption}
                    placeholder={"Press enter to add an option"}
                    mathjaxEnabled={input.optionsMathjaxEnabled}
                    setMathjaxError={setMathjaxError}
                />
                { input.optionsMathjaxEnabled && mathjaxError &&
                    <p style={{color: 'red'}}>Error: {mathjaxError}</p>
                }
            </label>
            <label>
                Answer
                <Select
                    options={options}
                    isSearchable={false}
                    value={{
                        value: input.answer[0],
                        label: !input.answer.length ? '...' : <Math text={input.answer[0]} enabled={input.optionsMathjaxEnabled} />
                    }}
                    onChange={(value, action) => {
                        if (action.action === 'select-option') {
                            setInput(prevState => ({ ...prevState, answer: [value.value]}))
                        }
                    }}
                    styles={selectStyles}
                />
                {/* Answer
                <select
                    value={input.answer[0]}
                    onChange={e => setInput(prevState => ({ ...prevState, answer: [e.target.value]})) }
                >
                    { input.options.map((option, index) =>
                        <option
                            key={index}
                            value={option}
                        >
                            <Math text={option} enabled={input.optionsMathjaxEnabled} />
                        </option>
                    ) }
                </select> */}
            </label>
        </>
    );
}

export default SingleAnswerEditor;