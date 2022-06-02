import React, { useState, useEffect, createRef } from 'react';

import InputTags from './InputTags';

import './InputTags.css';
import './InputCloze.css';
import DeleteButton from './DeleteButton';
import AutosizingInput from './AutosizingInput';
import LoadingSpinner from './LoadingSpinner';

// Answer is an array containing strings and arrays of strings
const InputCloze = ({ input, setInput }) => {
    const [fieldRefs, setFieldRefs] = useState([]);

    // Set up refs for the fields
    useEffect(() => {
        setFieldRefs(fieldRefs => Array(input.answer.length).fill().map((_, i) => fieldRefs[i] || createRef()));
    }, [input.answer.length]);

    const [fieldState, setFieldState] = useState('');

    /**
     * Focus on the field to the left of inputIndex
     * @param {Number} inputIndex
     * @param {Event} e
     */
    const focusLeftField = (inputIndex, e) => {
        const fieldIndex = fieldRefs[inputIndex].current.selectionStart;

        // Focus on the field to the left
        if (fieldIndex <= 0 && inputIndex > 0) {
            e.preventDefault();
            const leftField = fieldRefs[inputIndex - 1].current;

            leftField.focus();
            leftField.selectionStart = leftField.value.length;
            leftField.selectionEnd = leftField.value.length;
        }
    }

    /**
     * Focus on the field to the right of inputIndex
     * @param {Number} inputIndex 
     * @param {Event} e
     */
    const focusRightField = (inputIndex, e) => {
        const fieldIndex = fieldRefs[inputIndex].current.selectionStart;

        // Focus on the field to the right
        if (fieldIndex >= fieldRefs[inputIndex].current.value.length && inputIndex < input.answer.length - 1) {
            e.preventDefault();
            const rightField = fieldRefs[inputIndex + 1].current;

            rightField.focus();
            rightField.selectionStart = 0;
            rightField.selectionEnd = 0;
        }
    }

    const handleKeyDown = (inputIndex, e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addBlank(inputIndex);
        } else if (e.key === 'ArrowLeft') {
            focusLeftField(inputIndex, e);
        } else if (e.key === 'ArrowRight') {
            focusRightField(inputIndex, e);
        } else if (e.key === 'Backspace') {
            handleBackspaceOnBlank(inputIndex, e);
        }
    }

    const handleBackspaceOnBlank = (inputIndex, e) => {
        const fieldIndex = fieldRefs[inputIndex].current.selectionStart;

        // Focus on the field to the left
        if (fieldIndex <= 0 && inputIndex > 0) {
            e.preventDefault();

            // if the field to the left is a blank, remove it
            if (Array.isArray(input.answer[inputIndex - 1])) {
                removeBlank(inputIndex - 1);
            }

            // focus new field
            const fieldToFocus = fieldRefs[Math.max(inputIndex - 2, 0)].current;
            fieldToFocus.focus();
        }
    }

    /**
     * Insert a blank within the input field given by `inputIndex`
     * @param {Number} inputIndex 
     */
    const addBlank = inputIndex => {
        // the index within the current field at which to split
        const splitIndex = fieldRefs[inputIndex].current.selectionStart;

        // need to split into three components
        const leftInput = input.answer[inputIndex].substring(0, splitIndex);
        const blank = [];
        const rightInput = input.answer[inputIndex].substring(splitIndex);

        let newAnswer = [ ...input.answer ];
        // add left input
        newAnswer.splice(Math.max(0, inputIndex), 0, leftInput);
        // place blank in middle
        const middleIndex = inputIndex + 1;
        newAnswer[middleIndex] = blank;
        // add right input
        const rightIndex = inputIndex + 2;
        newAnswer.splice(rightIndex, 0, rightInput);

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

    if (!fieldRefs)
        return <LoadingSpinner />;

    return (
        <div className={styling}>
            { input.answer && input.answer.map((ans, index) => (
                typeof ans === 'string' ? (
                    <AutosizingInput
                        value={input.answer[index] || ''}
                        key={index}
                        ref={fieldRefs[index]}
                        inputstyle={{
                            border: 'none',
                            outline: 'none',
                            background: 'rgba(255, 255, 255, 0)',
                            flexGrow: index === input.answer.length - 1 ? 1 : 0,
                            minHeight: '45px',
                        }}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onMouseEnter={() => { if (fieldState !== 'focused') setFieldState('hover') }}
                        onMouseLeave={() => { if (fieldState === 'hover') setFieldState('') }}
                        onFocus={() => setFieldState('focused')}
                        onBlur={() => setFieldState('')}
                        onChange={e => setInput(prevState => {
                            e.preventDefault();
                            let newAnswer = [ ...prevState.answer ];
                            newAnswer[index] = e.target.value.replaceAll("\n", "").replaceAll("\t", "").replaceAll("\r", "");
                            return { ...prevState, answer: newAnswer };
                        })}
                    />
                ) : (
                    <div key={index} className='blanks'>
                        <InputTags
                            tags={input.answer[index]}
                            ref={fieldRefs[index]}
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
                            onKeyDown={(e) => {
                                if (e.key === 'ArrowLeft') {
                                    focusLeftField(index, e);
                                } else if (e.key === 'ArrowRight') {
                                    focusRightField(index, e);
                                }
                            }}
                            placeholder="Blanks"
                        />
                        <DeleteButton className="delete-blank" aria-label="Delete Blanks" tooltip="Delete Blanks" onClick={() => removeBlank(index)} />
                    </div>
                )
            ))}
        </div>
    )
}

export default InputCloze;