import React, { useState, createRef, useRef, useCallback, useLayoutEffect } from 'react';

import InputTags from './InputTags';
import DeleteButton from './DeleteButton';
import AutosizingInput from './AutosizingInput';

import styles from './InputCloze.module.css';

// Answer is an array containing strings and arrays of strings
const InputCloze = ({ input, setInput }) => {
    const [fieldRefs, setFieldRefs] = useState([]);
    const [fieldState, setFieldState] = useState('');
    const ref = useRef();

    // Set up refs for the fields
    useLayoutEffect(() => {
        setFieldRefs(fieldRefs => Array(input.answer.length).fill().map((_, i) => fieldRefs[i] || createRef()));
    }, [input.answer]);

    // update flex growth of text fields when field refs are set
    useLayoutEffect(() => {
        updateFlexGrowth();
    }, [fieldRefs]);

    // Set up ResizeObserver on component wrapper to update flex growth of text fields on resize
    useLayoutEffect(() => {
        if (!ref.current)
            return;
        
        const observer = new ResizeObserver(entries => {
            updateFlexGrowth();
        })
        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [ref, fieldRefs]);

    /**
     * Return whether the element input.answer[index] is a blank or a text field
     */
     const isBlank = useCallback(index => Array.isArray(input.answer[index]), [input]);

    /**
     * Updates all text fields on the last column of each row to take up remaining space inside component
     */
    const updateFlexGrowth = useCallback(() => {
        fieldRefs.forEach((ref, index) => {
            if (!isBlank(index)) {
                if (index === fieldRefs.length - 1) {  // the last field is not a blank
                    ref.current.style.flexGrow = 1;
                } else if (index + 1 < fieldRefs.length) {
                    // if the current field is not a blank, then the next field must be a blank
                    const nextRef = fieldRefs[index + 1].current;

                    let currContainer = ref.current;
                    let nextContainer = nextRef.parentElement.parentElement;

                    if (currContainer.offsetTop !== nextContainer.offsetTop) {
                        currContainer.style.flexGrow = 1;
                    } else {
                        currContainer.style.flexGrow = 0;
                    }
                }
            }
        })
    }, [fieldRefs]);

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
        if (fieldRefs[inputIndex].current.selectionStart !== fieldRefs[inputIndex].current.selectionEnd) {
            // don't delete a blank when pressing backspace while highlighting text
            return;
        }

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

    return (
        <div className={`${styles['input-cloze']} ${styles[fieldState]}`} ref={ref}>
            { input.answer && input.answer.map((ans, index) => {
                return !isBlank(index) ? (
                    <AutosizingInput
                        value={ans || ''}
                        key={index}
                        ref={fieldRefs[index]}
                        inputstyle={{
                            border: 'none',
                            outline: 'none',
                            background: 'rgba(255, 255, 255, 0)',
                            minHeight: '45px',
                        }}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onMouseEnter={() => { if (fieldState !== 'focus') setFieldState('hover') }}
                        onMouseLeave={() => { if (fieldState === 'hover') setFieldState('') }}
                        onFocus={() => setFieldState('focus')}
                        onBlur={() => setFieldState('')}
                        onChange={e => setInput(prevState => {
                            e.preventDefault();
                            let newAnswer = [ ...prevState.answer ];
                            newAnswer[index] = e.target.value.replaceAll("\n", "").replaceAll("\t", "").replaceAll("\r", "");
                            return { ...prevState, answer: newAnswer };
                        })}
                    />
                ) : (
                    <div className={styles['blanks']} key={index}>
                        <InputTags
                            inputClassName={styles['input-field']}
                            tagClassName={styles['input-tag']}
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
                            wordBreak={true}
                            placeholder="Blanks"
                        />
                        <DeleteButton className={styles['delete-blank']} background aria-label="Delete Blanks" tooltip="Delete Blanks" onClick={() => removeBlank(index)} />
                    </div>
                )
             }) }
        </div>
    )
}

export default InputCloze;