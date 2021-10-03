import mongoose from 'mongoose';

import ConceptModel from '../models/concept.js';
import QuestionModel from '../models/question.js';

import { verifyQuestion as verifyQ } from '../utils.js';

export const getQuestions = async (req, res) => {
    const { conceptId } = req.params;

    try {
        // Check to see if the concept with given id exists
        if (!mongoose.Types.ObjectId.isValid(conceptId))
            return res.status(404).send(`No concept found with id ${conceptId}`);

        const concept = await ConceptModel.findById(conceptId);

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
        // Check to see if the concept with given id exists
        if (!mongoose.Types.ObjectId.isValid(conceptId))
            return res.status(404).send(`No concept found with id ${conceptId}`);

        const concept = await ConceptModel.findById(conceptId);

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
    const question = req.body;

    try {
        // Check to see if the concept with given id exists
        if (!mongoose.Types.ObjectId.isValid(conceptId))
            return res.status(404).send(`No concept found with id ${conceptId}`);

        // fetch the concept document
        const concept = await ConceptModel.findById(conceptId);

        if (req.user.id !== concept.creator.toString())
            return res.status(403).json({ message: 'Unauthorized action' });

        // create the new question document
        const newQuestion = await new QuestionModel({ ...question, creator: req.userId }).save();

        // add the desired question
        concept.questions.push(newQuestion);

        await concept.save();
        // const newQuestions = [...concept.questions, newQuestion ];

        // await ConceptModel.findByIdAndUpdate(conceptId, { $set: { questions: newQuestions } }, { new: true });

        res.status(201).json(newQuestion);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateQuestion = async (req, res) => {
    const { conceptId, questionId } = req.params;
    const { title, type, text, answer, options } = req.body;

    // Check to see if the concept with given id exists
    if (!mongoose.Types.ObjectId.isValid(conceptId))
        return res.status(404).send(`No concept found with id ${conceptId}`);

    const concept = await ConceptModel.findById(conceptId);

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

    res.status(200).json(updatedQuestion);
}

export const deleteQuestion = async (req, res) => {
    const { conceptId, questionId } = req.params;

    // Check to see if the concept with given id exists
    if (!mongoose.Types.ObjectId.isValid(conceptId))
        return res.status(404).send(`No concept found with id ${conceptId}`);

    const concept = await ConceptModel.findById(conceptId);

    if (req.user.id !== concept.creator.toString())
        return res.status(403).json({ message: 'Unauthorized action' });
    
    await QuestionModel.findByIdAndRemove(questionId);

    // // fetch the concept object
    // const concept = await ConceptModel.findById(conceptId);
    
    // // Remove the desired question
    // const newQuestions = concept.questions.filter(question => question._id != questionId);

    // // Update the concept
    // await ConceptModel.findByIdAndUpdate(conceptId, { $set: { questions: newQuestions } }, { new: true });

    res.json({ message: 'Question deleted successfully' });
}

export const verifyQuestion = async (req, res) => {
    const { conceptId, questionId } = req.params;

    // Check to see if the concept with given id exists
    if (!mongoose.Types.ObjectId.isValid(conceptId))
        return res.status(404).send(`No concept found with id ${conceptId}`);

    // fetch the concept
    const concept = await ConceptModel.findById(conceptId);

    const question = concept.questions.find(q => q._id == questionId);

    return res.json(verifyQ(question));
}