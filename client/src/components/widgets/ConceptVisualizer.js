import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { getUsername } from '../../api';
import { addToCollection, removeFromCollection } from '../../actions/collections';

const ConceptVisualizer = ({ concept, remove, userId, showCreator, collection }) => {
    const [creator, setCreator] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        getUsername(concept.creator).then(res => setCreator(res.data));
    }, [concept.creator]);

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

    return (
        <div className="container secondary">
            <div className="flex space-between">
                <div className="center-flex">
                    <strong>{concept.title}</strong> { showCreator && <><div className="h-margin"></div> <p>by {creator}</p></> }
                </div>
                <div className="center-flex">
                    { collection ? (
                        <button onClick={handleAddRemoveToCollection} className="small-button margin">{ collection.concepts.includes(concept._id) ? 'Remove' : 'Add' }</button>
                    ) : (
                        <>
                            <Link className="small-button margin" to={`/concept/view/${concept._id}`}>View</Link>
                            { userId === concept.creator && <Link className="small-button margin" to={`/concept/edit/${concept._id}`}>Edit</Link> }
                            <Link className="small-button margin" to={`/practice/concept/${concept._id}`}>Practice</Link>
                            { userId === concept.creator && <span onClick={handleRemove} className="x"></span> }
                        </>
                    ) }
                </div>
            </div>
            <ul id="tags" className="remove-bullet left-flex ">
                Tags:
                { concept.tags.map((tag, index) => (
                    <li key={index}>
                        <div className="tag">{ tag }</div>
                    </li>
                )) }
            </ul>
        </div>
    )
};

export default ConceptVisualizer;