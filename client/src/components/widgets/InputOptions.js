import React, { useState } from 'react';
// import { Prompt } from 'react-router-dom';

import SaveButton from './SaveButton';
import ControlledTooltip from './ControlledTooltip';

import NewButton from './NewButton';
import DeleteButton from './DeleteButton';

const InputOptions = ({ options, addOption, editOption, removeOption, placeholder, tabIndex = 0 }) => {
    const [inputs, setInputs] = useState(options);

    // store message and popup open status for each option in component state
    const [messages, setMessages] = useState(options.map(_ => ''));
    const [open, setOpenStates] = useState(options.map(_ => false));

    /**
     * Sets the tooltip message for an option that will display upon change
     * @param {Integer} index the index of the option
     * @param {String} message the message to set
     */
    const setMessage = (index, message) => setMessages(prevMessages => {
        let newMessages = [...prevMessages];
        newMessages[index] = message;
        return newMessages;
    });

    /**
     * Sets whether the tooltip for an option is displayed
     * @param {Integer} index the index of the option
     * @param {Boolean} open whether or not the tooltip is displayed
     */
    const setOpen = (index, open) => setOpenStates(prevOpen => {
        let newOpen = [...prevOpen];
        newOpen[index] = open;
        return newOpen;
    });

    const madeChanges = JSON.stringify(inputs) !== JSON.stringify(options);

    /**
     * Adds a new field for an option
     */
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

    /**
     * Removes an option's field 
     * @param {Integer} index the index of the option
     */
    const handleRemoveOption = (index) => {
        removeOption(options[index]);
        setInputs(prevInputs => [...prevInputs.slice(0, index), ...prevInputs.slice(index + 1)]);
    }

    /**
     * Sets the option at index `index` to be `newOption`
     * @param {Integer} index 
     * @param {String} newOption 
     */
    const saveOption = (index, newOption) => {
        setOpen(index, true);

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
        setOpen(index, false);

        if (e.key === 'Enter') {
            e.preventDefault();
            saveOption(index, value);
        }
    }

    return (
        <div className="container no-margin">
            {/* <Prompt
                when={madeChanges}
                message='You have unsaved changes. Are you sure you want to leave?'
            /> */}
            <ul className="remove-bullet">
                { options && options.map((option, index) => {
                    return (
                        <li key={option} className="padding center-flex">
                            <input
                                tabIndex={tabIndex}
                                type="text"
                                value={inputs[index]}
                                onChange={e => setInputs(prevInputs => {
                                    let newInputs = [...prevInputs];
                                    newInputs[index] = e.target.value;
                                    return newInputs;
                                })}
                                placeholder={placeholder}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                onBlur={() => setOpen(index, false)}
                            />
                            <ControlledTooltip
                                active={open[index]}
                                setActive={active => setOpen(index, active)}
                                content={messages[index]}
                                direction={"right"}
                            >
                                <SaveButton
                                    className="h-margin"
                                    tabIndex={tabIndex}
                                    aria-label="Save Option"
                                    tooltip="Save Option"
                                    onClick={e => {
                                        e.preventDefault();
                                        saveOption(index, inputs[index]);
                                    }}
                                />
                            </ControlledTooltip>
                            <DeleteButton
                                onClick={() => handleRemoveOption(index)}
                                tabIndex={tabIndex}
                                aria-label="Delete Option"
                                tooltip="Delete Option"
                                background
                            />
                        </li>
                    );
                })}
                { <NewButton onClick={handleAddOption} aria-label="Create New Option" tooltip="Create New Option" tabIndex={tabIndex} /> }
            </ul>
        </div>
    );
};

export default InputOptions;