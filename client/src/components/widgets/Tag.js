import React from 'react';

import styles from './Tag.module.css';

const Tag = ({ tag, onClick }) => {
    return (
        <button
            className={styles.tag}
            onClick={e => {
                e.stopPropagation();
                onClick(tag);
            }}
        >
            {tag}
        </button>
    )
}

export default Tag;