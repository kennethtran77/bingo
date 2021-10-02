import React from 'react';

import Select from 'react-select';

import Math from '../../../widgets/Math';
import selectStyles from '../../../selectStyles';

const SingleAnswerPractice = ({ question, disabled, styles, input, setInput }) => {
    const options = question.options.map(option => ({
        value: option,
        label: <Math text={option} enabled={question.optionsMathjaxEnabled} />
    }));

    let style = !styles ? {} : input[0] === question.answer[0] ? styles.correctAnswer : styles.incorrectAnswer;

    return (
        <Select
            options={options}
            isSearchable={false}
            isDisabled={disabled}
            value={{
                value: input[0],
                label: !input[0] ? '...' : <Math text={input[0]} enabled={question.optionsMathjaxEnabled} />
            }}
            onChange={(value, action) => {
                if (action.action === 'select-option') {
                    setInput([value.value]);
                }
            }}
            styles={{
                ...selectStyles,
                control: (provided, state) => ({
                    ...provided,
                    ...style
                })
            }}
        />
    );
}

export default SingleAnswerPractice;