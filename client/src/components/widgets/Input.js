import React, { useState } from 'react';
import styles from './Input.module.css';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Input = (props) => {
    const { Icon, type, style, ...inputProps } = props;
    const [state, setState] = useState('');
    const [visible, setVisibile] = useState(false);

    const getType = () => {
        if (type === 'password') {
            return visible ? 'text' : 'password';
        } else {
            return type;
        }
    };

    return (
        <div className={`${props.className} ${styles.input} ${styles[state]} space-around`} onBlur={() => setState('')} onFocus={() => setState('active')} style={style}>
            <input
                type={getType()}
                { ...inputProps }
            />
            { type === 'password' &&
                <span className={`${styles.icon} h-margin center-flex`} onClick={() => setVisibile(prev => !prev)}>
                    { visible ? <VisibilityOffIcon/> : <VisibilityIcon /> }
                </span>
            }
        </div>
    );
};

export default Input;