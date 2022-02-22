import React, { useState } from 'react';
import ConfirmDelete from '../../../widgets/ConfirmDelete';

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
                <h2>{question.title}</h2>
                <div className="center-flex">
                    <button className="small-button" onClick={handleToggleEditor}>{showEditor ? 'Hide Editor' : 'Show Editor'}</button>
                    <span onClick={() => setToDelete(true)} className="h-margin x" aria-label="Delete Question" title="Delete Question"></span>
                </div>
            </div>
            { showEditor && <QuestionEditor concept={concept} question={question} /> }
        </div>
    );
}

export default QuestionVisualizer;