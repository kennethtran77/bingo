import React, { useState, useRef, createRef } from 'react';

import Popup from 'reactjs-popup';

const InputOptions = ({ options, addOption, editOption, removeOption, placeholder }) => {
    const [inputs, setInputs] = useState(options);
    const [messages, setMessages] = useState(options.map(_ => ''));

    const refs = useRef([]);

    const showSavePopup = (index, message) => {
        setMessages(prevMessages => {
            let newMessages = [...prevMessages];
            newMessages[index] = message;
            return newMessages;
        });
        refs.current[index].current.open();
    }

    const hideSavePopup = index => refs.current[index].current.close();

    // Initiate refs
    if (refs.current.length !== options.length) {
        refs.current = Array(options.length).fill().map((_, i) => refs.current[i] || createRef());
    }

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
            return;
        }

        if (options[index] !== newOption && options.find(option => option === newOption)) {
            showSavePopup(index, 'Save failed: Options must be unique');
            return;
        }

        editOption(index, newOption);
        showSavePopup(index, 'Saved!');
    }

    const handleKeyDown = (e, index) => {
        const value = e.target.value.trim();

        if (e.key === 'Enter' && value) {
            e.preventDefault();
            saveOption(index, value);
        } else {
            hideSavePopup(index);
        }
    }

    return (
        <div className="container">
            <ul className="remove-bullet">
                { options && options.map((option, index) => {
                    return (
                        <li key={index} className="padding center-flex">
                            <input
                                type="text"
                                value={inputs[index]}
                                onChange={e => setInputs(prevInputs => {
                                    hideSavePopup(index);
                                    let newInputs = [...prevInputs];
                                    newInputs[index] = e.target.value;
                                    return newInputs;
                                })}
                                placeholder={placeholder}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                            <Popup
                                ref={refs.current[index]}
                                trigger={
                                    <span onClick={() => saveOption(index, inputs[index])} className="h-margin save"></span>
                                }
                                position="right center"
                                closeOnDocumentClick
                            >
                                <span>{messages[index]}</span>
                            </Popup>
                            <span onClick={(e) => {
                                e.preventDefault();
                                handleRemoveOption(index);
                            }} className="x h-margin"></span>
                        </li>
                    );
                })}
                { <span onClick={handleAddOption} className="plus"></span> }
            </ul>
        </div>
    );
};

export default InputOptions;