import React from 'react';
import { Link } from 'react-router-dom';

const CollectionVisualizer = ({ collection, remove }) => {
    const handleRemove = e => {
        e.preventDefault();
        remove();
    }

    return (
        <div className="container secondary">
            <div className="flex space-between">
                <div className="center-flex">
                    <strong>{collection.title}</strong>
                </div>
                <div className="center-flex">
                    <Link className="small-button margin" to={`/collection/edit/${collection._id}`}>Edit</Link>
                    <Link className="small-button margin" to={`/practice/collection/${collection._id}`}>Practice</Link>
                    <span onClick={handleRemove} className="x"></span>
                </div>
            </div>
            <ul id="tags" className="remove-bullet left-flex ">
                Tags:
                { collection.tags.map((tag, index) => (
                    <li key={index}>
                        <div className="tag">{ tag }</div>
                    </li>
                )) }
            </ul>
        </div>
    )
};

export default CollectionVisualizer;