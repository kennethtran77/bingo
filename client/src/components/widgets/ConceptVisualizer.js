import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { addToCollection, removeFromCollection } from '../../actions/collections';

import LikeButton from './LikeButton';
import ConfirmDelete from './ConfirmDelete';
import DislikeButton from './DislikeButton';

const ConceptVisualizer = ({ concept, remove, userId, showCreator, collection }) => {
    const { users } = useSelector(state => state.usersSlice);
    const creator = users.find(u => u._id === concept.creator);

    const [toDelete, setToDelete] = useState(false);

    const [showAllTags, setShowAllTags] = useState(false);

    const dispatch = useDispatch();

    const getRenderedTags = () => {
        return showAllTags ? concept.tags : concept.tags.slice(0, 10);
    }

    const handleRemove = e => {
        e.preventDefault();
        remove();
    }

    const handleAddRemoveToCollection = e => {
        e.preventDefault();

        // Remove
        if (collection.concepts.includes(concept._id)) {
            dispatch(removeFromCollection(collection, concept._id));
        // Add
        } else {
            dispatch(addToCollection(collection, concept._id));
        }
    }

    return toDelete ? <ConfirmDelete title={concept.title} undo={() => setToDelete(false)} confirm={handleRemove} /> : (
        <div className="container secondary">
            <div className="max-width">
                <div className="v-margin">
                    <strong>{concept.title}</strong> { showCreator && <span className="h-margin">by {creator.username}</span> }
                </div>
                <ul id="tags" className="remove-bullet left-flex ">
                    { getRenderedTags().map((tag, index) => (
                        <li key={index}>
                            <div className="tag">{ tag }</div>
                        </li>
                    )) }
                    { concept.tags.length > 10 && (
                        <span className="link" onClick={() => setShowAllTags(curr => !curr)}>{showAllTags ? '...Show Less Tags' : 'Show More Tags...'}</span>
                    )}
                </ul>
                <div className="right-flex">
                    { collection ? (
                        <button onClick={handleAddRemoveToCollection} className="small-button margin">{ collection.concepts.includes(concept._id) ? 'Remove' : 'Add' }</button>
                    ) : (
                        <>
                            <Link className="small-button margin" to={`/concept/view/${concept._id}`} aria-label="View Concept">View</Link>
                            { userId === concept.creator && <Link className="small-button margin" to={`/concept/edit/${concept._id}`} aria-label="Edit Concept">Edit</Link> }
                            <Link className="small-button margin" to={`/practice/concept/${concept._id}`} aria-label="Practice Concept">Practice</Link>
                            { userId === concept.creator && <span onClick={() => setToDelete(true)} className="x" aria-label="Delete Concept" title="Delete Concept"></span> }
                        </>
                    ) }
                </div>
                <div className="left-flex">
                    <LikeButton conceptId={concept._id}/>
                    <DislikeButton conceptId={concept._id}/>
                </div>
            </div>
        </div>
    )
};

export default ConceptVisualizer;