import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromHTML, convertToHTML } from 'draft-convert';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './TextEditor.css';

import './ConceptEditor.css';

import { updateConcept } from '../../../../../actions/concepts';

import InputTags from '../../../../widgets/InputTags';

const ConceptEditor = ({ concept, isLoading }) => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [input, setInput] = useState({ title: '', text: '', tags: [], public: true });

    const dispatch = useDispatch();

    useEffect(() => {
        if (concept) {
            setInput(concept);
            setEditorState(EditorState.createWithContent(convertFromHTML(concept.text ? concept.text : '')));
        }
    }, [concept]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateConcept(concept._id, input));
    }

    return (
        <div className="editor">
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
                            setInput({ ...input, text: convertToHTML(newState.getCurrentContent())});
                        }}
                        toolbar={{
                            options: ['inline', 'blockType', 'list', 'emoji', 'remove', 'history'],
                            inline: {
                                options: ['bold', 'italic', 'underline', 'monospace']
                            },
                            blockType: {
                                options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'Blockquote'],
                            }
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
                <input className="small-button" type="button" onClick={handleSubmit} value="Save" />
            </form>
            { isLoading && 'Loading...' }
        </div>
    );
}

export default ConceptEditor;