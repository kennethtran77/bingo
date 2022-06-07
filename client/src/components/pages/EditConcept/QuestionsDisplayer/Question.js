import React, { useState } from 'react';

import InfoIcon from '@mui/icons-material/Info';

import AccordionButton from '../../../widgets/AccordionButton';
import ConfirmDelete from '../../../widgets/ConfirmDelete';
import DeleteButton from '../../../widgets/DeleteButton';
import Tooltip from '../../../widgets/Tooltip';

import QuestionEditor from './editors/QuestionEditor';

const Question = ({ concept, question, remove }) => {
    const [showEditor, setShowEditor] = useState(false);
    const [toDelete, setToDelete] = useState(false);

    const handleToggleEditor = e => {
        e.preventDefault();
        setShowEditor(prevState => !prevState);
    }

    return toDelete ? (<ConfirmDelete title={question.title} confirm={remove} undo={() => setToDelete(false)} />)
    : (
        <div className="container secondary" tabIndex={0}>
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
            <div aria-expanded={showEditor} style={showEditor ? {
                // from closed to open
                maxHeight: '100vh',
                visibilty: 'visible',
                opacity: 1,
                transitionProperty: 'max-height, opacity',
                transitionDuration: '0.2s, 0.2s',
                transitionDelay: '0s, 0.2s',
                transitionTimingFunction: 'ease-in',
            } : {
                // from open to closed
                maxHeight: 0,
                visibility: 'hidden',
                opacity: 0,
                overflow: 'hidden',
                transitionProperty: 'opacity, visibility, max-height',
                transitionDuration: '0.2s, 0s, 0.2s',
                transitionDelay: '0s, 0.2s, 0.2s',
                transitionTimingFunction: 'ease-out',
            }}>
                <QuestionEditor concept={concept} question={question} />
            </div>
        </div>
    );
}

export default Question;