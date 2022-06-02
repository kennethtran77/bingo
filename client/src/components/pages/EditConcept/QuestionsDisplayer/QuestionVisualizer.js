import React, { useState } from 'react';

import InfoIcon from '@mui/icons-material/Info';

import AccordionButton from '../../../widgets/AccordionButton';
import ConfirmDelete from '../../../widgets/ConfirmDelete';
import DeleteButton from '../../../widgets/DeleteButton';
import Tooltip from '../../../widgets/Tooltip';

import QuestionEditor from './editors/QuestionEditor';

const QuestionVisualizer = ({ concept, question, remove }) => {
    const [showEditor, setShowEditor] = useState(false);
    const [toDelete, setToDelete] = useState(false);

    const handleToggleEditor = e => {
        e.preventDefault();
        setShowEditor(prevState => !prevState);
    }

    return toDelete ? (<ConfirmDelete title={question.title} confirm={remove} undo={() => setToDelete(false)} />)
    : (
        <div className="container secondary">
            <div className="flex space-between">
                { question.title ? <h2>{question.title}</h2> : (
                    <div className="center-flex gap">
                        <h2>{'<Untitled>'}</h2>
                        <Tooltip
                            direction='right'
                            content='This question will have a blank title during practice.'
                            showOnClick={false}
                        >
                            <InfoIcon />
                        </Tooltip>
                    </div>
                )}
                <div className="center-flex">
                    <AccordionButton open={showEditor} onClick={handleToggleEditor} tooltip={showEditor ? 'Hide Editor' : 'Show Editor'} />
                    <DeleteButton onClick={() => setToDelete(true)} className="h-margin" aria-label="Delete Question" tooltip="Delete Question" />
                </div>
            </div>
            { showEditor && <QuestionEditor concept={concept} question={question} /> }
        </div>
    );
}

export default QuestionVisualizer;