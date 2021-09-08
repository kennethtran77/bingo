import React from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { correctColour, incorrectColour } from '../../util';

import Math from './Math';

import './Reorder.css';

const Reorder = ({ title, componentType, order, setOrder, mathjaxEnabled, question }) => {
    const handleOnDragEnd = result => {
        if (!result.destination)
            return;

        // Compute the new order
        let newOrder = [...order];
        const [reorderedItem] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, reorderedItem);

        setOrder(newOrder);
    }

    const disabled = componentType !== 'practice' && componentType !== 'edit';

    return disabled ? (
        <ul className="reorder" >
            { order.map((item, index) => {
                let styles = {};

                if (componentType === 'resultsUserInput') {
                    if (item === question.answer[index]) {
                        // correct
                        styles.backgroundColor = correctColour;
                    } else {
                        // incorrect
                        styles.backgroundColor = incorrectColour;
                    }
                }

                return (
                    <li key={index} style={styles}>
                        <Math text={item} enabled={mathjaxEnabled} />
                    </li>
                )
            }) }
        </ul>
    ) : (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={title}>
                {(provided) => (
                    <ul className="reorder" { ...provided.droppableProps} ref={provided.innerRef} >
                        { order.map((item, index) => (
                            <Draggable key={item} draggableId={item} index={index}>
                                {(provided) => (
                                    <li ref={provided.innerRef} { ...provided.draggableProps } { ...provided.dragHandleProps }>
                                        <Math text={item} enabled={mathjaxEnabled} />
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