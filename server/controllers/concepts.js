import mongoose from 'mongoose';

import ConceptModel from '../models/concept.js';
import QuestionModel from '../models/question.js';

export const getConcepts = async (req, res) => {
    try {
        // Return all concepts that are either public or created by the user
        const concepts = await ConceptModel.find({
            $or: [
                { 'public': true },
                { 'creator': req.user.id }
            ]
        });

        res.status(200).json(concepts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createConcept = async (req, res) => {
    const concept = req.body;

    const newConcept = new ConceptModel({
        ...concept,
        creator: req.user.id
    });

    try {
        await newConcept.save();

        res.status(201).json(newConcept);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateConcept = async (req, res) => {
    const { conceptId } = req.params;
    const { title, text, tags, questions } = req.body;

    // Check to see if the concept with given id exists
    if (!mongoose.Types.ObjectId.isValid(conceptId))
        return res.status(404).send(`No concept found with id ${conceptId}`);

    const concept = await ConceptModel.findById(conceptId);

    if (req.user.id !== concept.creator.toString())
        return res.status(403).json({ message: 'Unauthorized action' });

    concept.title = title;
    concept.text = text;
    concept.tags = tags;
    concept.public = req.body.public;
    concept.questions = questions;

    await concept.save();

    // await ConceptModel.findByIdAndUpdate(conceptId, updatedConcept, { new: true });

    res.status(200).json(concept);
}

export const deleteConcept = async (req, res) => {
    const { conceptId } = req.params;

    const concept = await ConceptModel.findById(conceptId);

    if (!mongoose.Types.ObjectId.isValid(conceptId))
        return res.status(404).send(`No concept found with id ${conceptId}`);
    
    if (req.user.id !== concept.creator.toString())
        return res.status(403).json({ message: 'Unauthorized action' });
    
    // Delete all of this concept's questions
    for (let i = 0; i < concept.questions.length; i++) {
        const question = concept.questions[i];
        await QuestionModel.findByIdAndRemove(question);
    }

    await concept.delete();
    // await ConceptModel.findByIdAndRemove(conceptId);

    res.json({ message: 'Concept deleted successfully' })
}