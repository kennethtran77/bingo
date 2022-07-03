import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DeleteIcon from '@mui/icons-material/Delete';

import ConfirmDelete from '../../widgets/ConfirmDelete';
import Tag from '../../widgets/Tag';
import Button from '../../widgets/Button';

const Collection = ({ collection, remove, handleTagClick }) => {
    const [toDelete, setToDelete] = useState(false);

    const [state, setState] = useState('');

    const [showAllTags, setShowAllTags] = useState(false);

    const navigate = useNavigate();

    const getRenderedTags = () => {
        return showAllTags ? collection.tags : collection.tags.slice(0, 10);
    }

    const handleRemove = e => {
        e.preventDefault();
        remove();
    }

    return toDelete ? <ConfirmDelete title={collection.title} undo={() => setToDelete(false)} confirm={handleRemove} /> : (
        <div
            className="container"
            tabIndex={0}
            onMouseEnter={() => setState('hover')}
            onMouseLeave={() => setState('')}
            style={{ outline: state === 'hover' ? '1px solid darkgrey' : '', cursor: state === 'hover' ? 'pointer' : '' }}
            onClick={e => {
                navigate(`/collection/edit/${collection._id}`);
            }}
        >
            <Link className="link" style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }} to={`/collection/edit/${collection._id}`}>{collection.title}</Link>
            <ul id="tags" className="remove-bullet left-flex ">
                { getRenderedTags().map((tag, index) => (
                    <li key={index}>
                        <Tag tag={tag} onClick={handleTagClick} />
                    </li>
                )) }
                { collection.tags.length > 10 && (
                    <span className="coloured-link" onClick={() => setShowAllTags(curr => !curr)}>{showAllTags ? '...Show Less Tags' : 'Show More Tags...'}</span>
                )}
            </ul>
            <div className="right-flex gap">
                <Button link={`/practice/collection/${collection._id}`} Icon={<LightbulbIcon />} text="Practice" />
                <Button link={`/collection/edit/${collection._id}`} Icon={<EditIcon />} tooltip="Edit" />
                <Button onClick={() => setToDelete(true)} Icon={<DeleteIcon />} tooltip="Delete" />
            </div>
        </div>
    );
};

export default Collection;