import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsername } from '../../api';

const ConceptsVisualizer = ({ concept, remove, userId, displayAll }) => {
    const [creator, setCreator] = useState('');

    useEffect(() => {
        getUsername(concept.creator).then(res => setCreator(res.data));
    }, [concept.creator]);

    const handleRemove = e => {
        e.preventDefault();
        remove();
    }

    return (
        <div className="container secondary">
            <div className="flex space-between">
                <div className="center-flex">
                    <strong>{concept.title}</strong> { displayAll && <><div className="h-margin"></div> <p>by {creator}</p></> }
                </div>
                <div className="center-flex">
                    <Link className="small-button margin" to={`/concept/${concept._id}`}>View</Link>
                    { userId === concept.creator && <Link className="small-button margin" to={`/edit/${concept._id}`}>Edit</Link> }
                    <Link className="small-button margin" to={`/practice/${concept._id}`}>Practice</Link>
                    { userId === concept.creator && <span onClick={handleRemove} className="x"></span> }
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

export default ConceptsVisualizer;