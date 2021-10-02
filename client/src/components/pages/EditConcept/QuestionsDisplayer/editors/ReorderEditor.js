import React, { useState, useEffect } from 'react';

import Reorder from '../../../../widgets/Reorder';
import InputTags from '../../../../widgets/InputTags';

import MathjaxOption from '../../../../widgets/MathjaxOption';
import InputOptions from '../../../../widgets/InputOptions';

const ReorderEditor = ({ title, input, setInput, handleEditOption }) => {
    const [mathjaxError, setMathjaxError] = useState('');

    const answerHasSameElementsAsOrder = input.answer.length === input.options.length && input.answer.every(item => input.options.includes(item));
    const order = answerHasSameElementsAsOrder ? input.answer : input.options;

    // Update the answer to be the current order
    useEffect(() => {
        setInput(prevState => ({ ...prevState, answer: order }) );
    }, [order, setInput, input.type]);

    const handleAddOption = option => setInput(prevState => ({
        ...prevState,
        options: [ ...prevState.options, option ],
        answer: [ ...prevState.answer, option ]
    }))

    const handleRemoveOption = option => setInput(prevState => ({
        ...prevState,
        options: prevState.options.filter(o => o !== option),
        answer: prevState.answer.filter(o => o !== option)
    }))

    return (
        <>
            <label>
                Options
                <MathjaxOption
                    enabled={input.optionsMathjaxEnabled}
                    setEnabled={enabled => setInput({ ...input, optionsMathjaxEnabled: enabled})}
                />
                <InputOptions
                    options={input.options}
                    addOption={handleAddOption}
                    removeOption={handleRemoveOption}
                    editOption={handleEditOption}
                    placeholder={"Enter a unique option"}
                />
                {/* <InputTags
                    className="input"
                    tags={input.options}
                    addTag={handleAddOption}
                    removeTag={handleRemoveOption}
                    placeholder={"Press enter to add an option"}
                    mathjaxEnabled={input.optionsMathjaxEnabled}
                    setMathjaxError={setMathjaxError}
                /> */}
                { input.optionsMathjaxEnabled && mathjaxError &&
                    <p style={{color: 'red'}}>Error: {mathjaxError}</p>
                }
            </label>
            <label>
                Correct Order
                <div className="container">
                    <Reorder
                        title={title}
                        order={input.answer}
                        setOrder={newOrder => setInput(prevState => ({ ...prevState, answer: newOrder }))}
                        mathjaxEnabled={input.optionsMathjaxEnabled}
                        setMathjaxError={setMathjaxError}
                    />
                </div>
            </label>
        </>
    );
}

export default ReorderEditor;