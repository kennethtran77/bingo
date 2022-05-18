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

import Modal from '../../../../widgets/Modal';
import Tooltip from '../../../../widgets/Tooltip';

const FILL_IN_THE_BLANK = 'FillInTheBlank';
const SINGLE_ANSWER = 'SingleAnswer';
const MULTIPLE_ANSWERS = 'MultipleAnswers';
const REORDER = 'Reorder';

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
            case FILL_IN_THE_BLANK:
                return <FillInTheBlankEditor input={input} setInput={setInput} />;
            case MULTIPLE_ANSWERS:
                return <MultipleAnswersEditor input={input} setInput={setInput} handleEditOption={handleEditOption} />;
            case REORDER:
                return <ReorderEditor title={question.title} input={input} setInput={setInput} handleEditOption={handleEditOption} />;
            case SINGLE_ANSWER:
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

    const handleChangeType = e => {
        const newType = e.target.value;

        setInput(prevInput => {
            // clear answer upon change
            let newInput = { ...prevInput, type: newType };

            switch (newType) {
                case REORDER:
                    newInput.answer = [prevInput.options];
                    break;
                case FILL_IN_THE_BLANK:
                    newInput.answer = [''];
                    break;
                case SINGLE_ANSWER:
                    newInput.answer = prevInput.options.length ? [prevInput.options[0]] : [];
                    break;
                default:
                    newInput.answer = [];
                    break;
            }

            return newInput;
        });
    }

    return (
        <div className="editor">
            <Prompt
                when={madeChanges}
                message='You have unsaved changes. Are you sure you want to leave?'
            />
            {/* <Alert
                message='WARNING: This question is not complete. It will not be shown during practice.'
                open={alertOpen}
                setOpen={setAlertOpen}
            /> */}
            <Modal
                content='WARNING: This question is not complete. It will not be shown during practice.'
                active={alertOpen}
                setActive={setAlertOpen}
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
                        onChange={handleChangeType}
                    >
                        <option value={FILL_IN_THE_BLANK}>Fill-in-The-Blank</option>
                        <option value={SINGLE_ANSWER}>Single Answer</option>
                        <option value={MULTIPLE_ANSWERS}>Multiple Answers</option>
                        <option value={REORDER}>Reorder</option>
                    </select>
                </label>
                <label>
                    Text
                    <Tooltip content={
                        <div onClick={() => setDisplayPreview(curr => !curr)}>{ displayPreview ? 'Hide ' : 'Show '} Preview</div>
                    }>
                        <div className="more" />
                    </Tooltip>
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
                    <Modal
                        content="hi"
                        
                    >
                        <button
                            className="small-button v-margin"
                            onClick={e => {
                                e.preventDefault();
                                
                            }}
                        >
                            Test
                        </button>
                    </Modal>
                </div>
            </form>
        </div>
    );
}

export default QuestionEditor;