import React from 'react';

import Reorder from '../../../widgets/Reorder';

const ReorderPractice = ({ question, disabled, styles, input, setInput }) => {

    if (styles) {
        styles.itemStyles = (index) => input[index] == question.answer[index] ? styles.correctAnswer : styles.incorrectAnswer;
    }

    return (
        <Reorder
            title={question.title}
            disabled={disabled}
            styles={styles}
            order={input}
            setOrder={setInput}
            mathjaxEnabled={question.optionsMathjaxEnabled}
        />
    );
}

export default ReorderPractice;