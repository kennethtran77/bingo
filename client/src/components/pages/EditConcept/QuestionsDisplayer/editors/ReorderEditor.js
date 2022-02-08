import React, { useEffect } from 'react';

import Reorder from '../../../../widgets/Reorder';
import InputOptions from '../../../../widgets/InputOptions';

const ReorderEditor = ({ title, input, setInput, handleEditOption }) => {
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
                <InputOptions
                    options={input.options}
                    addOption={handleAddOption}
                    removeOption={handleRemoveOption}
                    editOption={handleEditOption}
                    placeholder={"Enter a unique option"}
                />
            </label>
            <label>
                Correct Order
                <div className="container">
                    <Reorder
                        title={title}
                        order={input.answer}
                        setOrder={newOrder => setInput(prevState => ({ ...prevState, answer: newOrder }))}
                    />
                </div>
            </label>
        </>
    );
}

export default ReorderEditor;