import React, { useState } from 'react';

import QuestionEditor from './editors/QuestionEditor';

const QuestionVisualizer = ({ concept, question, remove }) => {
    const [showEditor, setShowEditor] = useState(false);

    const handleToggleEditor = e => {
        e.preventDefault();
        setShowEditor(prevState => !prevState);
    }

    const handleDelete = e => {
        e.preventDefault();
        remove();
    }

    return (
        <div className="container secondary">
            <div className="flex space-between">
                <h2>{question.title}</h2>
                <div className="center-flex">
                    <button className="small-button" onClick={handleToggleEditor}>{showEditor ? 'Hide Editor' : 'Show Editor'}</button>
                    <span onClick={handleDelete} className="x"></span>
                </div>
            </div>
            { showEditor && <QuestionEditor concept={concept} question={question} /> }
        </div>
    );
}

export default QuestionVisualizer;