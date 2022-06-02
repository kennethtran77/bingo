import React from 'react';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import styles from './LikeDislike.module.css';

const LikeDislike = ({ userId, likes, dislikes, like, dislike }) => {
    return (
        <div className="left-flex">
            <div className={styles['button-wrapper']}>
                <span
                    className={styles['button']}
                    role='button'
                    aria-label="Like Concept"
                    title="Like Concept"
                    >
                    <ThumbUpIcon
                        tabIndex={0}
                        style={{ color: likes.includes(userId) ? 'dodgerblue' : 'black' }}
                        onClick={like}
                    />
                </span>
                <span>{likes.length}</span>
            </div>
            <div className={styles['button-wrapper']}>
                <span
                    className={styles['button']}
                    role='button'
                    aria-label="Dislike Concept"
                    title="Dislike Concept"
                    >
                    <ThumbDownIcon
                        tabIndex={0}
                        style={{ color: dislikes.includes(userId) ? '#D22B2B' : 'black' }}
                        onClick={dislike}
                    />
                </span>
                <span>{dislikes.length}</span>
            </div>
        </div>
    );
};

export default LikeDislike;