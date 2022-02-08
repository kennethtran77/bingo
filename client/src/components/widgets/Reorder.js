import React, { useEffect, useState } from 'react';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import './Reorder.css';

const Reorder = ({ title, disabled, styles, order, setOrder }) => {
    // local input state to prevent visual glitch...
    const [localState, setLocalState] = useState(order);

    const handleOnDragEnd = result => {
        if (!result.destination)
            return;

        // Compute the new order
        let newOrder = [...order];
        const [reorderedItem] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, reorderedItem);

        // update the parent
        setOrder(newOrder);

        // update local state
        setLocalState(prevState => {
            let newLocalState = [...prevState];
            const [reorderedItem] = newLocalState.splice(result.source.index, 1);
            newLocalState.splice(result.destination.index, 0, reorderedItem);
            return newLocalState;
        });
    }

    useEffect(() => {
        if (order) {
            setLocalState(order);
        }
    }, [order]);

    return disabled ? (
        <ul className="reorder" >
            { order.map((item, index) =>
                <li key={index} style={!styles ? {} : styles.itemStyles(index)}>
                    <Latex>{item}</Latex>
                </li>
            )}
        </ul>
    ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={title}>
                {(provided) => (
                    <ul className="reorder" { ...provided.droppableProps} ref={provided.innerRef} >
                        { localState.map((item, index) => (
                            <Draggable key={item} draggableId={item} index={index}>
                                {(provided) => (
                                    <li style={!styles ? {} : styles.itemStyles(index)} ref={provided.innerRef} { ...provided.draggableProps } { ...provided.dragHandleProps }>
                                        <Latex>{item}</Latex>
                                    </li>
                                )}
                            </Draggable>
                        )) }
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default Reorder;