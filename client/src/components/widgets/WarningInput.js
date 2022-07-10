import React, { useState, useEffect } from 'react';

import ControlledTooltip from './ControlledTooltip';
import Input from './Input';

const WarningInput = (props) => {
    const [warningMessage, setWarningMessage] = useState('');
    const [showWarningMessage, setShowWarningMessage] = useState(false);

    // subscriptions is an array of values that when changed, will trigger the warning message to update
    const { label, validate = () => {}, subscriptions = [], ...inputProps } = props;

    useEffect(() => {
        if (inputProps.value) {
            const response = validate(inputProps.value);
            setWarningMessage(!response.success ? response.message : '');
            setShowWarningMessage(!response.success);
        } else {
            setShowWarningMessage(false);
        }
    }, [...subscriptions, inputProps.value]);

    const getLabelColour = () => {
        if (inputProps.value.length) {
            return warningMessage ? 'red' : 'green';
        } else {
            return '';
        }
    }

    return (
        <label>
            <div className="left-flex gap" style={{color: getLabelColour() }}>
                {label}
            </div>
            <ControlledTooltip
                active={showWarningMessage}
                content={warningMessage}
                setActive={active => setShowWarningMessage(active)}
                onFocus={() => {
                    if (warningMessage.length)
                        setShowWarningMessage(true);
                }}
                onBlur={() => setShowWarningMessage(false)}
                direction='right'
            >
                <Input { ...inputProps} />
            </ControlledTooltip>
        </label>
    );
};

export default WarningInput;