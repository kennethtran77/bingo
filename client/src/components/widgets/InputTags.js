import React, { useState } from 'react';
import DeleteButton from './DeleteButton';

import styles from './InputTags.module.css';

const InputTags = ({ className = '', inputClassName = '', tagClassName = '', id = '', tags, addTag, removeTag, placeholder, maxLength, onKeyDown = (e) => {} }, ref) => {
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

    return (
        <div className={`${styles['input-tags']} ${styles[fieldState]} ${className}`} id={id}>
            { tags && tags.map((tag, index) => (
                <span className={`${styles['input-tag']} ${tagClassName}`} tabIndex={0} key={index} >
                    <span className={styles.text}>{tag}</span>
                    <DeleteButton className={`${styles['delete-button']} h-margin`} onClick={() => removeTag(tag)} fontSize={'15px'} />
                </span>
            )) }
            <input
                className={inputClassName}
                type="text"
                value={value}
                ref={ref}
                maxLength={maxLength}
                autoComplete="off"
                placeholder={placeholder ? placeholder : ""}
                onKeyDown={handleKeyDown}
                onMouseEnter={() => { if (fieldState !== 'focus') setFieldState('hover') }}
                onMouseLeave={() => { if (fieldState === 'hover') setFieldState('') }}
                onFocus={() => setFieldState('focus')}
                onBlur={() => setFieldState('')}
                onChange={e => setValue(e.target.value)}
            />
        </div>
    )
}

export default React.forwardRef(InputTags);