import React, { useState, useEffect } from 'react';

import Reorder from '../../../../widgets/Reorder';
import InputTags from '../../../../widgets/InputTags';

import MathjaxOption from '../../../../widgets/MathjaxOption';

const ReorderEditor = ({ title, input, setInput }) => {
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
                    className="input"
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
                Correct Order
                <div className="container">
                    <Reorder
                        title={title}
                        order={input.answer}
                        setOrder={newOrder => setInput(prevState => ({ ...prevState, answer: newOrder }))}
                        componentType="edit"
                        mathjaxEnabled={input.optionsMathjaxEnabled}
                    />
                </div>
            </label>
        </>
    );
}

export default ReorderEditor;