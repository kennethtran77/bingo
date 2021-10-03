import React, { useState, useRef, useEffect, createRef } from 'react';

import Popup from 'reactjs-popup';

const InputOptions = ({ options, addOption, editOption, removeOption, placeholder }) => {
    const [inputs, setInputs] = useState(options);
    const [message, setMessage] = useState('');

    const refs = useRef([]);

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
            setMessage('Options must be unique.');
            return;
        }

        editOption(index, newOption);
    }

    const handleKeyDown = (e, index) => {
        const value = e.target.value.trim();

        if (e.key === 'Enter' && value) {
            e.preventDefault();
            saveOption(index, value);
            refs.current[index].current.open();
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
                                    setMessage('');
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
                                <span>Saved!</span>
                            </Popup>
                            <span onClick={() => handleRemoveOption(index)} className="x h-margin"></span>
                        </li>
                    );
                })}
                <p>{ message }</p>
                { <span onClick={handleAddOption} className="plus"></span> }
            </ul>
        </div>
    );
};

export default InputOptions;