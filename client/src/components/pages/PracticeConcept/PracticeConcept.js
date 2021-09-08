import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams, useHistory, Link } from 'react-router-dom';

import { generateQuestions } from '../../../api';

import PracticeVisualizer from './PracticeVisualizer';
import { processSession } from '../../../actions/practice';

const PracticeConcept = ({ userId }) => {
    // State hooks
    let [input, setInput] = useState([]);
    const [chosenQuestions, setChosenQuestions] = useState([]);
    const [toRender, setToRender] = useState('Loading...');

    const { conceptId } = useParams();
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);

    const dispatch = useDispatch();
    const history = useHistory();

    // Check if the concept with the given id exists
    const concept = concepts.find(c => c._id === conceptId);

    const settings = useSelector(state => state.settingsSlice.settings);

    const handleSubmit = useCallback(() => {
        if (!userId || !chosenQuestions)
            return;

        const inputs = input.map((input, index) => ({
            conceptId: concept._id,
            questionId: chosenQuestions[index]._id,
            input: input,
            type: chosenQuestions[index].type,
            title: chosenQuestions[index].title,
            text: chosenQuestions[index].text,
            options: chosenQuestions[index].options,
            answer: chosenQuestions[index].answer,
            textMathjaxEnabled: chosenQuestions[index].textMathjaxEnabled,
            optionsMathjaxEnabled: chosenQuestions[index].optionsMathjaxEnabled
        }));

        dispatch(processSession(concept.title, inputs, history));
    }, [dispatch, userId, chosenQuestions, concept?._id, concept?.title, history, input]);

    // Load the concept and generate the questions
    useEffect(() => {
        // If the concept hasn't loaded yet
        if (isLoading && !concept) {
            setToRender('Loading...');
            return;
        }

        // If we finished loading but couldn't find the concept, return to homepage
        if (!concept && !isLoading) {
            setToRender(<Redirect to="/"/>);
            return;
        }

        if (!concept.questions.length) {
            setToRender(
                <>
                    <p>This concept has no practicable questions!</p>
                    <Link to="/" className="small-button">Go Home</Link>
                </>
            );
        }

        // Fetch questions
        generateQuestions(concept._id, settings.questionsPerSession)
            .then(res => {
                const questions = res.data;

                // fill in inputs
                setInput(questions.map(question => {
                    switch (question.type) {
                        case 'FillInTheBlank':
                            return question.answer.map(answer => Array.isArray(answer) ? '' : null);
                        case 'SingleAnswer':
                            return [];
                        case 'MultipleAnswers':
                            return [];
                        case 'Reorder':
                            return question.options;
                        default:
                            return [];
                    }
                }));

                if (!questions.length) {
                    setToRender(
                        <>
                            <p>This concept has no practicable questions!</p>
                            <Link to="/" className="small-button">Go Home</Link>
                        </>
                    );
                    return;
                }

                setChosenQuestions(questions);
            })
            .catch(err => console.log(err));
    }, [concept, isLoading, userId]);

    // Render the practice questions once they are chosen
    useEffect(() => {
        if (concept && chosenQuestions && chosenQuestions.length) {
            setToRender(
                <>
                    <h1>Practice Concept: {concept.title}</h1>
                    <ul className="remove-bullet">
                        { chosenQuestions.map((question, index) => (
                            <li key={index}>
                                <PracticeVisualizer
                                    question={question}
                                    index={index}
                                    componentType='practice'
                                    input={input[index]}
                                    setInput={newField => {
                                        setInput(prevInput => {
                                            let newInput = [...prevInput];
                                            newInput[index] = newField;
                                            return newInput;
                                        });
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                    <button className="small-button" onClick={handleSubmit}>Submit</button>
                </>
            );
        }
    }, [concept, chosenQuestions, input, handleSubmit]);

    return toRender;
}

export default PracticeConcept;