import React, { useEffect, useState } from 'react';

import Reorder from '../../../../widgets/Reorder';
import InputOptions from '../../../../widgets/InputOptions';
import OrderingSelector from '../../../../widgets/OrderingSelector';

const ReorderEditor = ({ title, input, setInput, handleEditOption }) => {
    // currOrdering is an index that represents the current ordering to edit
    // 0 <= currOrdering < input.answer.length
    const [currOrdering, setCurrOrdering] = useState(0);
    
    // order is a singular array representing the current ordering
    const [order, setOrder] = useState(input.options);

    // update order state
    useEffect(() => {
        setOrder(input.answer[currOrdering]);
    }, [input, currOrdering]);

    const handleAddOption = option => setInput(prevState => ({
        ...prevState,
        options: [ ...prevState.options, option ],
        answer: prevState.answer.map(ordering => ordering.concat(option)) // add `option` to all orderings
    }))

    const handleRemoveOption = option => setInput(prevState => ({
        ...prevState,
        options: prevState.options.filter(o => o !== option),
        answer: prevState.answer.map(ordering => ordering.filter(o => o !== option)) // remove all occurrences of `option`
    }))
    
    const addOrdering = () => setInput(prevState => ({
        ...prevState,
        answer: prevState.answer.concat([input.options])
    }));

    /**
     * Set the ordering at index `index` to be `ordering`
     * @param {Integer} index 
     * @param {Array} ordering 
     */
    const setOrdering = (index, ordering) => setInput(prevState => ({
        ...prevState,
        answer: prevState.answer.slice(0, index).concat([ordering]).concat(prevState.answer.slice(index + 1))
    }));

    /**
     * Delete the ordering at index `index`
     * @param {Integer} index
     */
    const deleteOrdering = (index) => setInput(prevState => ({
        ...prevState,
        answer: prevState.answer.slice(0, index).concat(prevState.answer.slice(index + 1))
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
                Correct Orders
                <div className="container">
                    { !input.options.length ? <p>Create some options first.</p> : 
                        <>
                            <OrderingSelector
                                currOrdering={currOrdering}
                                selectOrdering={setCurrOrdering}
                                orderings={input.answer}
                                addOrdering={addOrdering}
                                deleteOrdering={deleteOrdering}
                            />
                            <Reorder
                                title={title}
                                order={order}
                                setOrder={newOrder => setOrdering(currOrdering, newOrder)}
                            />
                        </>
                    }
                </div>
            </label>
        </>
    );
}

export default ReorderEditor;