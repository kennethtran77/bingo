import React, { useEffect, useState } from 'react';
import InputTags from '../../../../widgets/InputTags';
import MathjaxOption from '../../../../widgets/MathjaxOption';

import Math from '../../../../widgets/Math';

const MultipleAnswersEditor = ({ input, setInput }) => {
    const [mathjaxError, setMathjaxError] = useState('');

    useEffect(() => {
        // Force answer to be a subset of options
        if (!input.answer.every(item => input.options.includes(item))) {
            setInput(prevState => ({ ...prevState, answer: input.options.length ? [input.options[0]] : [] }));
        }
    }, [input.answer, input.options, setInput]);

    const handleTick = option => {
        // Remove option as answer
        if (input.answer.includes(option)) {
            setInput(prevState => ({ ...prevState, answer: prevState.answer.filter(answer => answer !== option) }));
        } else {
        // Add option as answer
            setInput(prevState => ({ ...prevState, answer: [ ...prevState.answer, option ] }));
        }
    }

    const handleAddOption = option => {
        setInput(prevState => ({ ...prevState, options: [ ...prevState.options, option ] }))
    }

    const handleRemoveOption = option => setInput(prevState => ({
        ...prevState,
        options: prevState.options.filter(t => t !== option),
        answer: prevState.answer.filter(t => t !== option)
    }))

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
                Answers
                    <ul className="container remove-bullet">
                        { input.options.length ? input.options.map((option, index) => (
                            <li key={index} className="container">
                                <label><Math text={option} enabled={input.optionsMathjaxEnabled} setError={setMathjaxError} /></label>
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={input.answer.includes(option)}
                                    onChange={() => handleTick(option)}
                                />
                            </li>
                        )) : <p>Add some options...</p> }
                    </ul>
            </label>
        </>
    );
}

export default MultipleAnswersEditor;