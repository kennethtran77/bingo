import React from 'react';
import InputOptions from '../../../../widgets/InputOptions';

import Latex from 'react-latex-next';

const MultipleAnswersEditor = ({ input, setInput, handleEditOption }) => {
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
        options: prevState.options.filter(o => o !== option),
        answer: prevState.answer.filter(o => o !== option)
    }))

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
                Answers
                    <div className="container no-margin">
                        { !input.options.length ? <p>Create some options first.</p> :
                            <ul className="remove-bullet">
                                { input.options.map((option, index) => (
                                    <li key={index} className="secondary container">
                                        <label><Latex>{option}</Latex></label>
                                        <input
                                            type="checkbox"
                                            value={option}
                                            checked={input.answer.includes(option)}
                                            onChange={() => handleTick(option)}
                                        />
                                    </li>
                                ))}
                            </ul>
                        }
                    </div>
            </label>
        </>
    );
}

export default MultipleAnswersEditor;