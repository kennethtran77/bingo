import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { addToCollection, removeFromCollection } from '../../actions/collections';

import LikeDislike from './LikeDislike';
import ConfirmDelete from './ConfirmDelete';
import { dislikeConcept, likeConcept } from '../../actions/concepts';
import Tag from './Tag';
import Button from './Button';

import ConceptOptions from './ConceptOptions';

const Concept = ({ concept, remove, userId, showCreator, collection, handleTagClick }) => {
    const { users } = useSelector(state => state.usersSlice);
    const creator = users.find(u => u._id === concept.creator);

    const navigate = useNavigate();
    const [state, setState] = useState('');

    const [toDelete, setToDelete] = useState(false);

    const [showAllTags, setShowAllTags] = useState(false);

    const dispatch = useDispatch();

    const getRenderedTags = () => {
        return showAllTags ? concept.tags : concept.tags.slice(0, 10);
    }

    if (!creator)
        return <LoadingSpinner />;

    return toDelete ? <ConfirmDelete title={concept.title} undo={() => setToDelete(false)} confirm={remove} /> : (
        <div
            className="container"
            tabIndex={0}
            onMouseEnter={() => setState('hover')}
            onMouseLeave={() => setState('')}
            style={{ outline: state === 'hover' ? '1px solid darkgrey' : '', cursor: state === 'hover' ? 'pointer' : '' }}
            onClick={e => navigate(`/concept/view/${concept._id}`)}
        >
            <Link className="link" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }} to={`/concept/view/${concept._id}`}>{concept.title}</Link> { showCreator && <span className="h-margin">by {creator.username}</span> }
            <ul id="tags" className="remove-bullet left-flex ">
                { getRenderedTags().map((tag, index) => (
                    <li key={index}>
                        <Tag tag={tag} onClick={handleTagClick ? handleTagClick : () => {}} />
                    </li>
                )) }
                { concept.tags.length > 10 && (
                    <span className="coloured-link" onClick={e => {
                        e.stopPropagation();
                        setShowAllTags(curr => !curr);
                    }}>{showAllTags ? '...Show Less Tags' : 'Show More Tags...'}</span>
                )}
            </ul>
            <div className="space-between">
                <LikeDislike
                    userId={userId}
                    likes={concept.likes}
                    dislikes={concept.dislikes}
                    like={() => dispatch(likeConcept(concept._id))}
                    dislike={() => dispatch(dislikeConcept(concept._id))}
                />
                { collection ? 
                    collection.concepts.includes(concept._id) ?
                        <Button
                            text="Remove"
                            Icon={<RemoveIcon />}
                            onClick={() => dispatch(removeFromCollection(collection, concept._id))}
                        />
                        :
                        <Button
                            text="Add"
                            Icon={<AddIcon />}
                            onClick={() => dispatch(addToCollection(collection, concept._id))}
                        />
                :
                    <ConceptOptions userId={userId} concept={concept} setToDelete={setToDelete} />
                }
            </div>
        </div>
    )
};

export default Concept;