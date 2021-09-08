import React from 'react';

import Reorder from '../../../widgets/Reorder';

const ReorderPractice = ({ question, index, componentType, input, setInput }) => {

    return (
        <Reorder
            question={question}
            title={question.title}
            componentType={componentType}
            order={input}
            setOrder={setInput}
            mathjaxEnabled={question.optionsMathjaxEnabled}
        />
    );
}

export default ReorderPractice;