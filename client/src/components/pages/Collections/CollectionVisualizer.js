import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ConfirmDelete from '../../widgets/ConfirmDelete';

const CollectionVisualizer = ({ collection, remove }) => {
    const [toDelete, setToDelete] = useState(false);

    const handleRemove = e => {
        e.preventDefault();
        remove();
    }

    return toDelete ? <ConfirmDelete title={collection.title} undo={() => setToDelete(false)} confirm={handleRemove} /> : (
        <div className="container secondary">
            <div className="flex space-between">
                <div className="center-flex">
                    <strong>{collection.title}</strong>
                </div>
                <div className="center-flex">
                    <Link className="small-button margin" to={`/collection/edit/${collection._id}`} aria-label="Edit Collection">Edit</Link>
                    <Link className="small-button margin" to={`/practice/collection/${collection._id}`} aria-label="Practice Collection">Practice</Link>
                    <span onClick={() => setToDelete(true)} className="x" aria-label="Delete Collection" title="Delete Collection"></span>
                </div>
            </div>
            <ul id="tags" className="remove-bullet left-flex ">
                { collection.tags.map((tag, index) => (
                    <li key={index}>
                        <div className="tag">{ tag }</div>
                    </li>
                )) }
            </ul>
        </div>
    );
};

export default CollectionVisualizer;