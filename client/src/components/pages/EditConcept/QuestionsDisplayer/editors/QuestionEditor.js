import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import 'katex/dist/katex.min.css';
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
    const [input, setInput] = useState({ type: 'FillInTheBlank', title: 'New Question', text: "It's quiet here...", answer: [], options: [] });
    const [displayLatexPreview, setDisplayLatexPreview] = useState(false);

    const [alertOpen, setAlertOpen] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (question) {
            setInput(question);
        }
    }, [question]);

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
    }

    const menuOptions = ['latexDisplay'];

    return (
        <div className="editor">
            <Alert
                message='Warning: this question is not complete. It will not be shown during practice.'
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
                        displayLatexPreview={displayLatexPreview}
                        toggleLatexPreview={() => setDisplayLatexPreview(curr => !curr)}
                    />
                    <input
                        type='text'
                        className="input"
                        value={input.text}
                        onChange={e => setInput({ ...input, text: e.target.value })}
                        autoComplete="off"
                    />
                </label>
                { displayLatexPreview &&
                    <>
                        Latex Preview
                        <div className="container">
                            <Latex>{input.text}</Latex>
                        </div>
                    </>
                }
                { fetchEditor(input.type) }
                <input className="small-button" type="button" onClick={handleSubmit} value="Save" />
            </form>
        </div>
    );
}

export default QuestionEditor;