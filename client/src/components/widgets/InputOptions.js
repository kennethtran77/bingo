import React, { useState } from 'react';

const InputOptions = ({ options, addOption, editOption, removeOption }) => {
    const [inputs, setInputs] = useState(options);
    const [message, setMessage] = useState('');

    const handleAddOption = () => {
        let counter = options.length + 1;
        let value = 'New Option ' + counter;

        while (options.includes(value)) {
            counter += 1;
            value = 'New Option ' + counter;
            console.log('test');
        }

        addOption(value);
        setInputs(prevInputs => [...prevInputs, value]);
    }

    const handleRemoveOption = (index) => {
        removeOption(options[index]);
        setInputs(prevInputs => [...prevInputs.slice(0, index), ...prevInputs.slice(index + 1)]);
        console.log('Removing index ' + index);
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
        }
    }

    return (
        <div className="container">
            <ul className="remove-bullet">
                { options && options.map((option, index) => {
                    return (
                        <div className="padding center-flex">
                            <input
                                type="text"
                                value={inputs[index]}
                                onChange={e => setInputs(prevInputs => {
                                    setMessage('');
                                    let newInputs = [...prevInputs];
                                    newInputs[index] = e.target.value;
                                    return newInputs;
                                })}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                            <span onClick={() => saveOption(index, inputs[index])} className="h-margin save"></span>
                            <span onClick={() => handleRemoveOption(index)} className="x"></span>
                        </div>
                    );
                })}
                <p>{ message }</p>
                { <span onClick={handleAddOption} className="plus"></span> }
            </ul>
        </div>
    );
};

export default InputOptions;