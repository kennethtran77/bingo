import React from 'react';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

import Select from 'react-select';

import selectStyles from '../../../selectStyles';

const SingleAnswerPractice = ({ question, disabled, styles, input, setInput }) => {
    const options = question.options.map(option => ({
        value: option,
        label: <Latex>{option}</Latex>
    }));

    let style = !styles ? {} : input[0] === question.answer[0] ? styles.correctAnswer : styles.incorrectAnswer;

    return (
        <Select
            options={options}
            isSearchable={false}
            isDisabled={disabled}
            value={{
                value: input[0],
                label: !input[0] ? '...' : <Latex>{input[0]}</Latex>
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