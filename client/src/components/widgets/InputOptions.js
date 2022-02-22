import React, { useState, useRef, createRef, useEffect } from 'react';
import { Prompt } from 'react-router-dom';

import Popup from 'reactjs-popup';

const InputOptions = ({ options, addOption, editOption, removeOption, placeholder }) => {
    const [inputs, setInputs] = useState(options);

    // store message and popup open status for each option in component state
    const [messages, setMessages] = useState(options.map(_ => ''));

    const refs = useRef([]);

    const setMessage = (index, message) => setMessages(prevMessages => {
        let newMessages = [...prevMessages];
        newMessages[index] = message;
        return newMessages;
    });

    // Initiate refs
    if (refs.current.length !== options.length) {
        refs.current = Array(options.length).fill().map((_, i) => refs.current[i] || createRef());
    }

    const madeChanges = JSON.stringify(inputs) !== JSON.stringify(options);

    const handleAddOption = () => {
        let counter = options.length + 1;
        let value = 'New Option ' + counter;

        while (options.includes(value)) {
            counter += 1;
            value = 'New Option ' + counter;
        }

        addOption(value);
        setInputs(prevInputs => [...prevInputs, value]);
    }

    const handleRemoveOption = (index) => {
        removeOption(options[index]);
        setInputs(prevInputs => [...prevInputs.slice(0, index), ...prevInputs.slice(index + 1)]);
    }

    const saveOption = (index, newOption) => {
        if (!newOption) {
            setMessage(index, 'Save failed: Options cannot be empty.');
            return;
        }

        if (options[index] !== newOption && options.find(option => option === newOption)) {
            setMessage(index, 'Save failed: Options must be unique.');
            return;
        }

        editOption(index, newOption);
        setMessage(index, 'Saved!');
        openPopup(index);
    }

    const handleKeyDown = (e, index) => {
        const value = e.target.value.trim();

        if (e.key === 'Enter') {
            e.preventDefault();
            saveOption(index, value);
            openPopup(index);
        } else {
            refs.current[index].current.close();
        }
    }

    // open the popup for option with given index with a delay
    const openPopup = index => {
        setTimeout(() => {
            refs.current[index].current.open();
        }, 10);
    };

    return (
        <div className="container">
            <Prompt
                when={madeChanges}
                message='You have unsaved changes. Are you sure you want to leave?'
            />
            <ul className="remove-bullet">
                { options && options.map((option, index) => {
                    return (
                        <li key={option} className="padding center-flex">
                            <input
                                type="text"
                                value={inputs[index]}
                                onChange={e => setInputs(prevInputs => {
                                    refs.current[index].current.close();
                                    let newInputs = [...prevInputs];
                                    newInputs[index] = e.target.value;
                                    return newInputs;
                                })}
                                placeholder={placeholder}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                            <span
                                className="save"
                                style={{ marginLeft: 5 }}
                                aria-label="Save Option"
                                title="Save Option"
                                onClick={e => {
                                    e.preventDefault();
                                    saveOption(index, inputs[index]);
                                }}
                            >
                                ↓
                            </span>
                            <Popup
                                ref={refs.current[index]}
                                trigger={
                                    // use an empty element as the trigger
                                    <div style={{
                                        width: 0,
                                        height: 0,
                                        display: 'block',
                                        visibility: 'hidden'
                                    }} />
                                }
                                position="right center"
                                closeOnDocumentClick
                            >
                                <span>{messages[index]}</span>
                            </Popup>
                            <span
                                onClick={() => handleRemoveOption(index)}
                                className="x h-margin"
                                aria-label="Delete Option"
                                title="Delete Option"
                            />
                        </li>
                    );
                })}
                { <span onClick={handleAddOption} className="plus" aria-label="Create New Option" title="Create New Option"></span> }
            </ul>
        </div>
    );
};

export default InputOptions;