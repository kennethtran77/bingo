import React from 'react';

import Select from 'react-select';

import Math from '../../../widgets/Math';
import selectStyles from '../../../selectStyles';

import { correctColour, incorrectColour } from '../../../../util';

const SingleAnswerPractice = ({ question, componentType, input, setInput }) => {
    // const handleChange = e => {
    //     let newInput = [...input];
    //     newInput = [e.target[e.target.selectedIndex].getAttribute('name') === 'empty' ? null : e.target.value];
    //     setInput(newInput);
    // }
    
    const options = question.options.map(option => ({
        value: option,
        label: <Math text={option} enabled={question.optionsMathjaxEnabled} />
    }));

    let colour = 'white';

    if (componentType === 'resultsUserInput') {
        if (input[0] === question.answer[0]) {
            // correct
            colour = correctColour;
        } else {
            // incorrect
            colour = incorrectColour;
        }
    }

    return (
        <Select
            options={options}
            isSearchable={false}
            isDisabled={componentType !== 'practice'}
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
                    backgroundColor: colour
                })
            }}
        />
        // <select
        //     value={input[0]}
        //     onChange={handleChange}
        //     disabled={disableInput}
        // >
        //     <option key={0} name='empty'>...</option>
        //     { question.options.map((option, index) =>
        //         <option key={index + 1} value={option}>{option}</option>
        //     ) }
        // </select>
    );
}

export default SingleAnswerPractice;