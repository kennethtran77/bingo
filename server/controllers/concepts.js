import mongoose from 'mongoose';
import CommentModel from '../models/comment.js';

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
        return res.status(404).json({ message: `No concept found with id ${conceptId}`});

    const concept = await ConceptModel.findById(conceptId);

    if (req.user.id !== concept.creator.toString())
        return res.status(403).json({ message: 'Unauthorized action' });

    concept.title = title;
    concept.text = text;
    concept.tags = tags;
    concept.public = req.body.public;
    concept.questions = questions;

    await concept.save();

    res.status(200).json(concept);
}

export const deleteConcept = async (req, res) => {
    const { conceptId } = req.params;

    const concept = await ConceptModel.findById(conceptId);

    if (!mongoose.Types.ObjectId.isValid(conceptId))
        return res.status(404).json({ message: `No concept found with id ${conceptId}` });
    
    if (req.user.id !== concept.creator.toString())
        return res.status(403).json({ message: 'Unauthorized action' });
    
    // Delete all of this concept's questions
    for (let i = 0; i < concept.questions.length; i++) {
        const question = concept.questions[i];
        await QuestionModel.findByIdAndRemove(question);
    }

    // Delete all of this concept's comments
    for (let i = 0; i < concept.comments.length; i++) {
        const comment = concept.comments[i];
        await CommentModel.findByIdAndRemove(comment);
    }

    await concept.delete();
    // await ConceptModel.findByIdAndRemove(conceptId);

    res.json({ message: 'Concept deleted successfully' })
}

export const likeConcept = async (req, res) => {
    const { conceptId } = req.params;

    const concept = await ConceptModel.findById(conceptId);

    if (!mongoose.Types.ObjectId.isValid(conceptId))
        return res.status(404).json({ message: `No concept found with id ${conceptId}` });

    const userId = req.user.id;

    // Like the concept if not already liked
    if (!concept.likes.includes(userId)) {
        concept.likes = [...concept.likes, userId];

        // Remove dislike if the user already disliked
        if (concept.dislikes.includes(userId)) {
            concept.dislikes = concept.dislikes.filter(u => u.toString() !== userId);
        }
    } else { // Unlike the concept if already liked
        concept.likes = concept.likes.filter(u => u.toString() !== userId);
    }

    await concept.save();

    res.status(200).json(concept);
}

export const dislikeConcept = async (req, res) => {
    const { conceptId } = req.params;

    const concept = await ConceptModel.findById(conceptId);

    if (!mongoose.Types.ObjectId.isValid(conceptId))
        return res.status(404).json({ message: `No concept found with id ${conceptId}` });

    const userId = req.user.id;

    // Dislike the concept if not already disliked
    if (!concept.dislikes.includes(userId)) {
        concept.dislikes = [...concept.dislikes, userId];

        // Remove like if user already liked
        if (concept.likes.includes(userId)) {
            concept.likes = concept.likes.filter(u => u.toString() !== userId);
        }
    } else { // Un-dislike the concept if already disliked
        concept.dislikes = concept.dislikes.filter(u => u.toString() !== userId);
    }

    await concept.save();

    res.status(200).json(concept);
}