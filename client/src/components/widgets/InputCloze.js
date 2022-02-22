import React, { useState, useEffect, createRef } from 'react';
import AutosizeInput from 'react-input-autosize';

import InputTags from './InputTags';

import './InputTags.css';
import './InputCloze.css';

// Answer is an array containing strings and arrays of strings
const InputCloze = ({ input, setInput }) => {
    const [fieldRefs, setFieldRefs] = useState([]);

    // Set up refs for the fields
    useEffect(() => {
        setFieldRefs(fieldRefs => Array(input.answer.length).fill().map((_, i) => fieldRefs[i] || createRef()));
    }, [input.answer.length]);

    const [fieldState, setFieldState] = useState('');

    const handleKeyDown = (inputIndex, e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addBlank(inputIndex);
        } else if (e.key === 'ArrowLeft') {
            const fieldIndex = fieldRefs[inputIndex].current.input.selectionStart;

            // Focus on the field to the left
            if (fieldIndex <= 0 && inputIndex > 0) {
                const leftField = fieldRefs[inputIndex - 2].current.input;

                leftField.focus();
                leftField.selectionStart = leftField.value.length;
            }
        } else if (e.key === 'ArrowRight') {
            const fieldIndex = fieldRefs[inputIndex].current.input.selectionStart;

            // Focus on the field to the right
            if (fieldIndex >= input.answer[inputIndex].length && inputIndex < input.answer.length - 1) {
                const rightField = fieldRefs[inputIndex + 2].current.input;

                rightField.focus();
                rightField.selectionStart = 0;
            }
        }
    }

    const addBlank = inputIndex => {
        // the index within the current field at which to split
        const splitIndex = fieldRefs[inputIndex].current.input.selectionStart;

        // need to split into three components
        const left = input.answer[inputIndex].substring(0, splitIndex);
        const middle = [];
        const right = input.answer[inputIndex].substring(splitIndex);

        let newAnswer = [ ...input.answer ];
        // add left
        newAnswer.splice(Math.max(0, inputIndex), 0, left);
        // adjust middle
        newAnswer[inputIndex + 1] = middle;
        // add right
        newAnswer.splice(inputIndex + 2, 0, right);

        // update state
        setInput(prevState => ({ ...prevState, answer: newAnswer }));
    }

    const removeBlank = inputIndex => {
        // need to rejoin left and right components
        const left = input.answer[inputIndex - 1];
        const right = input.answer[inputIndex + 1];

        let newAnswer = [ ...input.answer ];
        // remove left
        newAnswer.splice(inputIndex - 1, 1);
        // adjust middle
        newAnswer[inputIndex - 1] = left.concat(right);
        // remove right
        newAnswer.splice(inputIndex, 1);
        
        // update state
        setInput(prevState => ({ ...prevState, answer: newAnswer }));
    }

    let styling = "input-tags input-cloze";

    if (fieldState === 'hover') {
        styling += ' hover';
    } else if (fieldState === 'focused') {
        styling += ' focus';
    }

    return (
        <div className={styling}>
            { input.answer && input.answer.map((ans, index) => (
                typeof ans === 'string' ? (
                    <AutosizeInput
                        value={input.answer[index] || ''}
                        key={index}
                        ref={fieldRefs[index]}
                        className={'full-width'}
                        inputStyle={{
                            minHeight: 30,
                            border: 'none',
                            outline: 'none',
                            maxWidth: '98%',
                            background: 'rgba(255, 255, 255, 0)',
                            wordWrap: 'break-word',
                            marginTop: 10,
                            marginBottom: 10
                        }}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onMouseEnter={() => { if (fieldState !== 'focused') setFieldState('hover') }}
                        onMouseLeave={() => { if (fieldState === 'hover') setFieldState('') }}
                        onFocus={() => setFieldState('focused')}
                        onBlur={() => setFieldState('')}
                        onChange={e => setInput(prevState => {
                            let newAnswer = [ ...prevState.answer ];
                            newAnswer[index] = e.target.value;
                            return { ...prevState, answer: newAnswer };
                        })}
                    />
                ) : (
                    <div key={index} className="blanks">
                        <InputTags
                            className='margin'
                            tags={input.answer[index]}
                            addTag={blank => setInput(prevState => {
                                let newAnswer = [ ...prevState.answer ]
                                newAnswer[index] = [ ...newAnswer[index], blank ];
                                return { ...prevState, answer: newAnswer }
                            })}
                            removeTag={blank => setInput(prevState => {
                                let newAnswer = [ ...prevState.answer ];
                                newAnswer[index] = newAnswer[index].filter(b => b !== blank);
                                return { ...prevState, answer: newAnswer }
                            })}
                            placeholder="Blanks"
                        />
                        <span className="x" aria-label="Delete Blanks" title="Delete Blanks" onClick={() => removeBlank(index)}></span>
                    </div>
                )
            ))}
        </div>
    )
}

export default InputCloze;