import React, { useState, useRef, createRef } from 'react';
import { Prompt } from 'react-router-dom';

import Popup from 'reactjs-popup';

const InputOptions = ({ options, addOption, editOption, removeOption, placeholder }) => {
    const [inputs, setInputs] = useState(options);
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
    }

    const handleKeyDown = (e, index) => {
        const value = e.target.value.trim();

        if (e.key === 'Enter') {
            e.preventDefault();
            saveOption(index, value);
            refs.current[index].current.open();
        } else {
            refs.current[index].current.close();
        }
    }

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
                            <Popup
                                ref={refs.current[index]}
                                onOpen={() => saveOption(index, inputs[index])}
                                trigger={
                                    <span className="h-margin save">
                                        <span
                                            aria-label="Save Option"
                                            title="Save Option"
                                        >
                                            ↓
                                        </span>
                                    </span>
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