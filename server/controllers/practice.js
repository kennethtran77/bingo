import mongoose from 'mongoose';

import UserModel from '../models/user.js';
import ConceptModel from '../models/concept.js';
import QuestionModel from '../models/question.js';
import PracticeSessionModel from '../models/practiceSession.js';
import CollectionModel from '../models/collection.js';

import { shuffle, verifyQuestion, verifyAnswer } from '../utils.js';


const shuffleReorderQuestions = questions => {
    questions.forEach((question, index) => {
        if (question.type === 'Reorder') {
            shuffle(question.options);
            questions[index] = question;
        }
    });
};

export const getSessions = async (req, res) => {
    const userId = req.user.id;

    try {
        const sessions = await PracticeSessionModel.find({ "userId": userId });

        res.status(200).send(sessions);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
}

export const generateConceptQuestions = async (req, res) => {
    const { conceptId } = req.params;
    const questionsPerSession = req.query.questionsPerSession;

    try {
        const concept = await ConceptModel.findById(conceptId);
        const questions = await QuestionModel.find({ "_id": { "$in": concept.questions } });

        // shuffle
        shuffle(questions);

        // filter
        let generatedQuestions = questions
            .filter(question => verifyQuestion(question))
            .slice(0, Math.min(questionsPerSession, questions.length));

        // shuffle the order in any reorder questions
        shuffleReorderQuestions(generatedQuestions);

        res.json(generatedQuestions);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
}

export const generateCollectionQuestions = async (req, res) => {
    const { collectionId } = req.params;
    const questionsPerSession = req.query.questionsPerSession;

    try {
        const collection = await CollectionModel.findById(collectionId);
        const concepts = await ConceptModel.find({ "_id": { "$in": collection.concepts } });
        const questions = await QuestionModel.find({ "_id": { "$in": concepts.reduce((currentQuestions, currentConcept) => currentQuestions.concat(currentConcept.questions), [])}});

        // shuffle
        shuffle(questions);

        let generatedQuestions = questions
            .filter(question => verifyQuestion(question))
            .slice(0, Math.min(questionsPerSession, questions.length));

        // shuffle the order in any reorder questions
        shuffleReorderQuestions(generatedQuestions);

        res.json(generatedQuestions);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
}

export const processSession = async (req, res) => {
    const { title, inputs } = req.body;
    const userId = req.user.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(userId))
            return res.status(404).send(`No user found with id ${userId}`);

        // fetch the user
        const user = await UserModel.findById(userId);

        const practiceQuestions = inputs.map(input => ({
            concept: input.conceptId,
            question: input.questionId,
            input: input.input,
            type: input.type,
            title: input.title,
            text: input.text,
            textMathjaxEnabled: input.textMathjaxEnabled,
            optionsMathjaxEnabled: input.optionsMathjaxEnabled,
            answer: input.answer,
            options: input.options
        }));

        // calculate the score
        const score = inputs.reduce((accumulator, input) => verifyAnswer(input, input.input) ? accumulator + 1 : accumulator, 0);

        // create the new practice session document
        const practiceSession = await new PracticeSessionModel({
            userId,
            title,
            practiceQuestions,
            score
        }).save();

        user.sessionsCompleted.push(practiceSession);
        await user.save();

        res.status(200).send(practiceSession);
    } catch (error) {
        console.log(error);
        res.status(404).send({ message: error.message });
    }
};