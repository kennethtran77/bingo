import React, { useState } from 'react';

import './InputTags.css';

import Math from './Math';

const InputTags = ({ className = '', id = '', tags, addTag, removeTag, placeholder, maxLength, mathjaxEnabled, setMathjaxError }) => {
    const [input, setInput] = useState('');
    const [fieldState, setFieldState] = useState('');
    
    const handleKeyDown = e => {
        const value = e.target.value.trim();

        if (e.key === 'Enter' && value) {
            e.preventDefault();
            // Check if tag exists
            if (tags.find(tag => tag === value)) {
                return;
            }
            
            setInput('');
            addTag(value);
        } else if (e.key === 'Backspace' && !value) {
            e.preventDefault();
            if (tags.length > 0) {
                setInput(tags[tags.length - 1]);
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
                <span className="input-tag" key={index}>
                    <Math text={tag} enabled={mathjaxEnabled} setError={setMathjaxError} />
                    <span className="x h-margin" onClick={() => removeTag(tag)}></span>
                </span>
            )) }
            <input
                id="input-tags-field"
                type="text"
                value={input}
                maxLength={maxLength}
                autoComplete="off"
                placeholder={placeholder ? placeholder : ""}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => { if (fieldState !== 'focused') setFieldState('hover') }}
                onMouseLeave={() => { if (fieldState === 'hover') setFieldState('') }}
                onFocus={() => setFieldState('focused')}
                onBlur={() => setFieldState('')}
                onChange={e => setInput(e.target.value)}
            />
        </div>
    )
}

export default InputTags;