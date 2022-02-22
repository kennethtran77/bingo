import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { Prompt } from 'react-router'

import Popup from 'reactjs-popup';

import Latex from 'react-latex-next';

import FillInTheBlankEditor from './FillInTheBlankEditor';
import SingleAnswerEditor from './SingleAnswerEditor';
import MultipleAnswersEditor from './MultipleAnswersEditor';
import ReorderEditor from './ReorderEditor';

import { updateQuestion } from '../../../../../actions/questions';
import { verifyQuestion } from '../../../../../util';

import Alert from '../../../../widgets/Alert';
import OptionsMenu from '../../../../widgets/OptionsMenu';

const QuestionEditor = ({ concept, question }) => {
    // answer should always be a subset of options
    const [input, setInput] = useState({ type: 'FillInTheBlank', title: 'New Question', text: "Enter some text for this question.", answer: [], options: [] });
    const [displayPreview, setDisplayPreview] = useState(false);

    const [alertOpen, setAlertOpen] = useState(false);

    const savedPopupRef = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (question) {
            setInput(question);
        }
    }, [question]);

    // True if the question was edited and not saved, False otherwise
    const madeChanges = input.type !== question.type || input.title !== question.title || input.text !== question.text || input.answer !== question.answer || (input.type !== 'FillInTheBlank' && input.options !== question.options);

    const handleEditOption = (index, newOption) => setInput(prevState => {
        let oldOption = prevState.options[index];
        let newOptions = [...prevState.options];
        newOptions[index] = newOption;
        
        return {
            ...prevState,
            options: newOptions,
            answer: prevState.answer.map(o => o === oldOption ? newOption : o)
        }
    });

    const fetchEditor = type => {
        switch(type) {
            case 'FillInTheBlank':
                return <FillInTheBlankEditor input={input} setInput={setInput} />;
            case 'MultipleAnswers':
                return <MultipleAnswersEditor input={input} setInput={setInput} handleEditOption={handleEditOption} />;
            case 'Reorder':
                return <ReorderEditor title={question.title} input={input} setInput={setInput} handleEditOption={handleEditOption} />;
            case 'SingleAnswer':
                return <SingleAnswerEditor input={input} setInput={setInput} handleEditOption={handleEditOption} />;
            default:
                return 'Error';
        }
    }

    const handleSubmit = e => {
        e.preventDefault();

        const updatedConcept = { ...input, concept: concept._id };
        dispatch(updateQuestion(concept, question._id, updatedConcept));

        if (!verifyQuestion(input)) {
            setAlertOpen(true);
        }

        savedPopupRef.current.open();
    }

    const menuOptions = ['latexDisplay'];

    return (
        <div className="editor">
            <Prompt
                when={madeChanges}
                message='You have unsaved changes. Are you sure you want to leave?'
            />
            <Alert
                message='WARNING: This question is not complete. It will not be shown during practice.'
                open={alertOpen}
                setOpen={setAlertOpen}
            />
            <form>
                <label>
                    Title
                    <input
                        className="input"
                        value={input.title}
                        type='text'
                        onChange={e => setInput({ ...input, title: e.target.value })}
                    />
                </label>
                <label>
                    Type
                    <select
                        value={input.type}
                        className="input"
                        onChange={e => setInput({ ...input, type: e.target.value })}
                    >
                        <option value="FillInTheBlank">Fill-in-The-Blank</option>
                        <option value="SingleAnswer">Single Answer</option>
                        <option value="MultipleAnswers">Multiple Answers</option>
                        <option value="Reorder">Reorder</option>
                    </select>
                </label>
                <label>
                    Text
                    <OptionsMenu
                        options={menuOptions}
                        displayPreview={displayPreview}
                        togglePreview={() => setDisplayPreview(curr => !curr)}
                    />
                    <textarea
                        className="input"
                        value={input.text}
                        onChange={e => setInput({ ...input, text: e.target.value })}
                        autoComplete="off"
                    />
                </label>
                { displayPreview &&
                    <>
                        Preview
                        <div className="container">
                            <Latex>{input.text}</Latex>
                        </div>
                    </>
                }
                { fetchEditor(input.type) }
                <div className="flex">
                    <input
                        className="small-button v-margin"
                        type="button"
                        value="Save"
                        onClick={handleSubmit}
                    />
                    <Popup
                        ref={savedPopupRef}
                        trigger={
                            // use an empty element as the trigger
                            <div style={{
                                width: 0,
                                height: 45,
                                display: 'inline-block',
                                visibility: 'hidden',
                            }} />
                        }
                        position="right center"
                        closeOnDocumentClick
                        closeOnEscape
                    >
                        <span>Saved question.</span>
                    </Popup>
                </div>
            </form>
        </div>
    );
}

export default QuestionEditor;