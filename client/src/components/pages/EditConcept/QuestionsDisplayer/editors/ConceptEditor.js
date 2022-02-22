import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Prompt } from 'react-router';

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import Popup from 'reactjs-popup';

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './TextEditor.css';

import './ConceptEditor.css';

import { updateConcept } from '../../../../../actions/concepts';

import InputTags from '../../../../widgets/InputTags';
import LoadingSpinner from '../../../../widgets/LoadingSpinner';

const ConceptEditor = ({ concept, isLoading }) => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [input, setInput] = useState({ title: '', text: '', tags: [], public: true });

    const dispatch = useDispatch();

    const savedPopupRef = useRef(null);

    const madeChanges = input.title !== concept.title || input.text !== concept.text || input.tags !== concept.tags || input.public !== concept.public;

    useEffect(() => {
        if (concept) {
            setInput(concept);

            const contentBlock = htmlToDraft(concept.text);

            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                setEditorState(editorState);
            }
        }
    }, [concept]);

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(updateConcept(concept._id, input));
        savedPopupRef.current.open();
    };

    return (
        <div className="editor">
            <Prompt
                when={madeChanges}
                message='You have unsaved changes. Are you sure you want to leave?'
            />
            <h2>Edit Concept</h2>
            <form className="form">
                <label>
                    Title
                    <input
                        className="input"
                        type="text"
                        name="text"
                        value={input.title || ''}
                        onChange={e => setInput({ ...input, title: e.target.value })}
                    />
                </label>
                <label>
                    Text
                    <Editor
                        wrapperClassName="wrapper-class"
                        editorClassName="editor-class"
                        toolbarClassName="toolbar-class"
                        editorState={editorState}
                        onEditorStateChange={newState => {
                            setEditorState(newState);
                            setInput({ ...input, text: draftToHtml(convertToRaw(newState.getCurrentContent()))});
                        }}
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'remove', 'history']
                        }}
                    />
                </label>
                <label>
                    Tags
                    <InputTags
                        className="input"
                        tags={input.tags}
                        addTag={tag => setInput(prevState => ({ ...prevState, tags: [ ...prevState.tags, tag ] })) }
                        removeTag={tag => setInput(prevState => ({ ...prevState, tags: prevState.tags.filter(t => t !== tag)})) }
                        maxLength={30}
                    />
                </label>
                <label>
                    Public
                    <input
                        className="input"
                        type="checkbox"
                        value={input.public}
                        checked={input.public}
                        onChange={() => setInput(prevState => ({ ...prevState, public: !prevState.public }))}
                    />
                </label>
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
                        <span>Saved concept.</span>
                    </Popup>
                </div>
            </form>
            { isLoading && <LoadingSpinner /> }
        </div>
    );
}

export default ConceptEditor;