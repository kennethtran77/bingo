import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { addToCollection, removeFromCollection } from '../../actions/collections';

import LikeDislike from './LikeDislike';
import ConfirmDelete from './ConfirmDelete';
import { dislikeConcept, likeConcept } from '../../actions/concepts';
import DeleteButton from './DeleteButton';

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

        if (!collection)
            return;

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
                            <Link className="small-button link margin" to={`/concept/view/${concept._id}`} aria-label="View Concept">View</Link>
                            { userId === concept.creator && <Link className="small-button link margin" to={`/concept/edit/${concept._id}`} aria-label="Edit Concept">Edit</Link> }
                            <Link className="small-button link margin" to={`/practice/concept/${concept._id}`} aria-label="Practice Concept">Practice</Link>
                            { userId === concept.creator && <DeleteButton onClick={() => setToDelete(true)} ariaLabel="Delete Concept" tooltip="Delete Concept"></DeleteButton> }
                        </>
                    ) }
                </div>
                <LikeDislike
                    userId={userId}
                    likes={concept.likes}
                    dislikes={concept.dislikes}
                    like={() => dispatch(likeConcept(concept._id))}
                    dislike={() => dispatch(dislikeConcept(concept._id))}
                />
            </div>
        </div>
    )
};

export default ConceptVisualizer;