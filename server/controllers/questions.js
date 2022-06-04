import ConceptModel from '../models/concept.js';
import QuestionModel from '../models/question.js';

import { verifyQuestion as verifyQ } from '../utils.js';

export const getQuestions = async (req, res) => {
    const { conceptId } = req.params;

    try {
        const concept = await ConceptModel.findById(conceptId);

        // Check to see if the concept with given id exists
        if (!concept)
            return res.status(404).send(`No concept found with id ${conceptId}`);

        if (req.user.id !== concept.creator.toString())
            return res.status(403).json({ message: 'Unauthorized action' });
        
        const ids = concept.questions;

        const questions = await QuestionModel.find({ "_id": { "$in": ids } });

        res.status(200).json(questions);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getQuestion = async (req, res) => {
    const { conceptId, questionId } = req.params;

    try {
        const concept = await ConceptModel.findById(conceptId);

        // Check to see if the concept with given id exists
        if (!concept)
            return res.status(404).send(`No concept found with id ${conceptId}`);

        if (req.user.id !== concept.creator.toString())
            return res.status(403).json({ message: 'Unauthorized action' });
        
        // fetch the question
        const question = await QuestionModel.findById(questionId);

        res.status(200).send(question);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createQuestion = async (req, res) => {
    const { conceptId } = req.params;

    try {
        const concept = await ConceptModel.findById(conceptId);

        // Check to see if the concept with given id exists
        if (!concept)
            return res.status(404).send(`No concept found with id ${conceptId}`);

        // check if user is authorized to add questions to concept
        if (req.user.id !== concept.creator.toString())
            return res.status(403).json({ message: 'Unauthorized action' });

        // create the new question document
        const newQuestion = await new QuestionModel({
            concept: conceptId,
            type: 'FillInTheBlank',
            title: 'New Question',
            text: 'Enter some text for this question.',
            answer: [],
            options: [],
            creator: req.userId
        }).save();

        // add the desired question
        concept.questions.push(newQuestion);

        await concept.save();

        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateQuestion = async (req, res) => {
    const { conceptId, questionId } = req.params;
    const { title, type, text, answer, options } = req.body;

    const concept = await ConceptModel.findById(conceptId);

    // Check to see if the concept with given id exists
    if (!concept)
        return res.status(404).send(`No concept found with id ${conceptId}`);

    if (req.user.id !== concept.creator.toString())
        return res.status(403).json({ message: 'Unauthorized action' });

    const updatedQuestion = {
        concept: conceptId,
        type,
        title,
        text,
        answer,
        options,
        _id: questionId
    };

    await QuestionModel.findByIdAndUpdate(questionId, updatedQuestion, { new: true });

    let responseObj = { updatedQuestion, message: 'Saved question.' };

    if (!verifyQ(updatedQuestion))
        responseObj.alert = 'This question is incomplete/invalid. It will not be shown during practice.';

    res.status(200).json(responseObj);
}

export const deleteQuestion = async (req, res) => {
    const { conceptId, questionId } = req.params;

    const concept = await ConceptModel.findById(conceptId);

    // Check to see if the concept with given id exists
    if (!concept)
        return res.status(404).send(`No concept found with id ${conceptId}`);

    if (req.user.id !== concept.creator.toString())
        return res.status(403).json({ message: 'Unauthorized action' });
    
    await QuestionModel.findByIdAndRemove(questionId);

    res.json({ message: 'Question deleted successfully' });
}

export const verifyQuestion = async (req, res) => {
    const { conceptId, questionId } = req.params;

    const concept = await ConceptModel.findById(conceptId);

    // Check to see if the concept with given id exists
    if (!concept)
        return res.status(404).send(`No concept found with id ${conceptId}`);

    const question = concept.questions.find(q => q._id == questionId);

    return res.json(verifyQ(question));
}