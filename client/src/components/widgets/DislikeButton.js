import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { dislikeConcept } from '../../actions/concepts';

const DislikeButton = ({ conceptId }) => {
    const { concepts } = useSelector(state => state.conceptsSlice);
    const concept = concepts.find(c => c._id === conceptId);

    const dispatch = useDispatch();

    if (!concept)
        return 'Loading...';

    const handleClick = e => {
        e.preventDefault();
        dispatch(dislikeConcept(conceptId));
    }

    return (
        <div className="left-flex">
            <span className="dislike" onClick={handleClick}></span>
            <span>{concept.dislikes.length}</span>
        </div>
    );
};

export default DislikeButton;