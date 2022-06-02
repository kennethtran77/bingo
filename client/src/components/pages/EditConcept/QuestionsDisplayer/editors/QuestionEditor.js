import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Latex from 'react-latex-next';

import { FILL_IN_THE_BLANK, REORDER, MULTIPLE_ANSWERS, SINGLE_ANSWER } from '../../../../../util';

import FillInTheBlankEditor from './FillInTheBlankEditor';
import SingleAnswerEditor from './SingleAnswerEditor';
import MultipleAnswersEditor from './MultipleAnswersEditor';
import ReorderEditor from './ReorderEditor';

import { updateQuestion } from '../../../../../actions/questions';

import Modal from '../../../../widgets/Modal';
import Tooltip from '../../../../widgets/Tooltip';
import Dropdown from '../../../../widgets/Dropdown';
import MenuButton from '../../../../widgets/MenuButton';

const QuestionEditor = ({ concept, question }) => {
    const [input, setInput] = useState({ type: FILL_IN_THE_BLANK, title: 'New Question', text: "Enter some text for this question.", answer: [''], options: [] });
    const [displayPreview, setDisplayPreview] = useState(false);

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if (question) {
            setInput(question);
        }
    }, [question]);

    // True if the question was edited and not saved, False otherwise
    const madeChanges = input.type !== question.type || input.title !== question.title || input.text !== question.text || input.answer !== question.answer || (input.type !== 'FillInTheBlank' && input.options !== question.options);

    /**
     * Replace the option at index `index` with `newOption`
     * @param {Number} index 
     * @param {String} newOption 
     */
    const handleEditOption = (index, newOption) => setInput(prevInput => {
        let oldOption = prevInput.options[index];
        let newOptions = [...prevInput.options];
        newOptions[index] = newOption;

        return {
            ...prevInput,
            options: newOptions,
            answer: 
                prevInput.type === REORDER ?  // replace all instances of oldOption with newOption
                    prevInput.answer.map(ordering => ordering.map(o => o === oldOption ? newOption : o )) : 
                    prevInput.answer.map(o => o === oldOption ? newOption : o)
        }
    });

    const questionTypes = {
        [FILL_IN_THE_BLANK]: {
            display: 'Fill-In-The-Blank',
            editor: <FillInTheBlankEditor input={input} setInput={setInput} />
        },
        [MULTIPLE_ANSWERS]: {
            display: 'Multiple Answers',
            editor: <MultipleAnswersEditor input={input} setInput={setInput} handleEditOption={handleEditOption} />
        },
        [REORDER]: {
            display: 'Reorder',
            editor: <ReorderEditor title={question._id} input={input} setInput={setInput} handleEditOption={handleEditOption} />
        },
        [SINGLE_ANSWER]: {
            display: 'Single Answer',
            editor: <SingleAnswerEditor input={input} setInput={setInput} handleEditOption={handleEditOption} />
        }
    };

    const handleSubmit = e => {
        e.preventDefault();

        const updatedConcept = { ...input, concept: concept._id };

        // dispatch the update question action and check response for alert message
        dispatch(updateQuestion(concept, question._id, updatedConcept))
        .then(res => {
            if (res.data.message) {
                setAlertMessage(res.data.message);
                setAlertOpen(true);
            }
        });
    }

    return (
        <div className="editor">
            {/* <Prompt
                when={madeChanges}
                message='You have unsaved changes. Are you sure you want to leave?'
            /> */}
            <Modal
                content={alertMessage}
                active={alertOpen}
                setActive={setAlertOpen}
                type={'warning'}
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
                    <Dropdown
                        items={Object.keys(questionTypes).map(questionType => ({
                            value: questionType,
                            display: questionTypes[questionType].display
                        }))}
                        currItem={{
                            value: input.type,
                            display: questionTypes[input.type].display
                        }}
                        onChange={newItem => {
                            setInput(prevInput => {
                                const newType = newItem.value;
                                let newInput = { ...prevInput, type: newType };
                    
                                // clear answer upon change
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
                        }}
                    />
                </label>
                <label>
                    <span className="flex">
                        Text
                        <Tooltip
                            showOnClick={true}
                            direction="right"
                            content={<span onClick={() => setDisplayPreview(prev => !prev)}>{ displayPreview ? 'Hide ' : 'Show '} Preview</span>}
                        >
                            <MenuButton />
                        </Tooltip>
                    </span>
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
                        <div className="container no-margin">
                            <Latex>{input.text}</Latex>
                        </div>
                    </>
                }
                { questionTypes[input.type].editor }
                <div className="flex">
                    <Tooltip
                        showOnClick={true}
                        content={"Saved question."}
                        direction={"right"}
                    >
                        <input
                            className="small-button v-margin"
                            type="button"
                            value="Save"
                            onClick={handleSubmit}
                        />
                    </Tooltip>
                </div>
            </form>
        </div>
    );
}

export default QuestionEditor;