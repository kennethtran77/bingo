import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { likeConcept } from '../../actions/concepts';

const LikeButton = ({ conceptId }) => {
    const { concepts } = useSelector(state => state.conceptsSlice);
    const concept = concepts.find(c => c._id === conceptId);

    const dispatch = useDispatch();

    if (!concept)
        return 'Loading...';

    const handleClick = e => {
        e.preventDefault();
        dispatch(likeConcept(conceptId));
    }

    return (
        <div className="left-flex">
            <span className="like" onClick={handleClick}></span>
            <span>{concept.likes.length}</span>
        </div>
    );
}

export default LikeButton;