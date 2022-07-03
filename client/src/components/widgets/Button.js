import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Button.module.css';

const Button = ({ Icon, text, link, onClick, tooltip, stopPropogation = true, width = 'auto', height = 'auto', align = 'left', disabled = false, border = false, background = false, vMargin = false, hMargin = false }) => {
    const style = {
        marginTop: vMargin ? '5px' : '',
        marginBottom: vMargin ? '5px' : '',
        marginLeft: hMargin ? '5px' : '',
        marginRight: hMargin ? '5px' : '',
        width,
        height
    };
    
    return (
        <div className="flex gap">
            { link ? 
                <Link
                    className={`${styles.button} ${border && styles.border} ${background && styles.background} ${disabled && styles.disabled} link`}
                    to={link}
                    title={tooltip}
                    disabled={disabled}
                    style={style}
                    onClick={e => {
                        if (stopPropogation) {
                            e.stopPropagation();
                        }
                    }}
                >
                    <span className={`${align}-flex`}>{Icon} {text}</span>
                </Link>
            :
                <span
                    className={`${styles.button} ${border && styles.border} ${background && styles.background} ${disabled && styles.disabled} link`}
                    role="button"
                    tabIndex={0}
                    onClick={e => {
                        if (stopPropogation) {
                            e.stopPropagation();
                        }
                        
                        if (!disabled && onClick) {
                            onClick();
                        }
                    }}
                    title={tooltip}
                    style={style}
                >
                    <span className={`${align}-flex`}>{Icon} {text}</span>
                </span>
            }
        </div>
    );
};

export default Button;