import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from './Button';

const ConceptOptions = ({ userId, concept, setToDelete }) => {
    return (
        <div className="flex gap">
            <Button link={`/practice/concept/${concept._id}`} Icon={<LightbulbIcon />} tooltip="Practice" text="Practice" />
            { userId === concept.creator && <Button link={`/concept/edit/${concept._id}`} Icon={<EditIcon />} tooltip="Edit" /> }
            { userId === concept.creator && <Button onClick={() => setToDelete(true)} Icon={<DeleteIcon />} tooltip="Delete" /> }
        </div>
    );
};

export default ConceptOptions;