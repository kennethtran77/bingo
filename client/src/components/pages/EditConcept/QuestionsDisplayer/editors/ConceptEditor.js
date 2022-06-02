import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './TextEditor.css';

import './ConceptEditor.css';

import { updateConcept } from '../../../../../actions/concepts';

import Tooltip from '../../../../widgets/Tooltip';
import InputTags from '../../../../widgets/InputTags';
import LoadingSpinner from '../../../../widgets/LoadingSpinner';

const ConceptEditor = ({ concept, isLoading }) => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [input, setInput] = useState({ title: '', text: '', tags: [], public: true });
    const [hasFocus, setHasFocus] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const dispatch = useDispatch();

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
        setSaveMessage('Saving...');
        dispatch(updateConcept(concept._id, input))
        .then(res => {
            if (res.data.message) {
                setSaveMessage(res.data.message);
            }
        });
    };

    return (
        <div className="editor">
            {/* <Prompt
                when={madeChanges}
                message='You have unsaved changes. Are you sure you want to leave?'
            /> */}
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
                        editorClassName={`editor-class ${hasFocus ? 'focus' : ''}`}
                        toolbarClassName="toolbar-class"
                        editorState={editorState}
                        onFocus={() => setHasFocus(true)}
                        onBlur={() => setHasFocus(false)}
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
                    <Tooltip
                        showOnClick={true}
                        content={saveMessage}
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
            { isLoading && <LoadingSpinner /> }
        </div>
    );
}

export default ConceptEditor;