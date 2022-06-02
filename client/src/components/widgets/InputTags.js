import React, { useState } from 'react';
import DeleteButton from './DeleteButton';

import './InputTags.css';

const InputTags = ({ className = '', id = '', tags, addTag, removeTag, placeholder, maxLength, onKeyDown = (e) => {} }, ref) => {
    const [value, setValue] = useState('');
    const [fieldState, setFieldState] = useState('');
    
    const handleKeyDown = e => {
        onKeyDown(e);

        const value = e.target.value.trim();

        if (e.key === 'Enter' && value) {
            e.preventDefault();
            // Check if tag exists
            if (tags.find(tag => tag === value)) {
                return;
            }
            
            setValue('');
            addTag(value);
        } else if (e.key === 'Backspace' && !value) {
            e.preventDefault();
            if (tags.length > 0) {
                setValue(tags[tags.length - 1]);
                removeTag(tags[tags.length - 1]);
            }
        }
    }

    let styling = "input-tags " + className;

    if (fieldState === 'hover') {
        styling += ' hover';
    } else if (fieldState === 'focused') {
        styling += ' focus';
    }

    return (
        <div className={styling} id={id}>
            { tags && tags.map((tag, index) => (
                <span className="input-tag" tabIndex={0} key={index} >
                    <span className="text">{tag}</span>
                    <DeleteButton className="delete h-margin" onClick={() => removeTag(tag)} fontSize={'15px'} />
                </span>
            )) }
            <input
                id="input-tags-field"
                type="text"
                value={value}
                ref={ref}
                maxLength={maxLength}
                autoComplete="off"
                placeholder={placeholder ? placeholder : ""}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => { if (fieldState !== 'focused') setFieldState('hover') }}
                onMouseLeave={() => { if (fieldState === 'hover') setFieldState('') }}
                onFocus={() => setFieldState('focused')}
                onBlur={() => setFieldState('')}
                onChange={e => setValue(e.target.value)}
            />
        </div>
    )
}

export default React.forwardRef(InputTags);