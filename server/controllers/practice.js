import mongoose from 'mongoose';

import UserModel from '../models/user.js';
import ConceptModel from '../models/concept.js';
import QuestionModel from '../models/question.js';
import PracticeSessionModel from '../models/practiceSession.js';
import CollectionModel from '../models/collection.js';

import { shuffle, verifyQuestion, verifyAnswer } from '../utils.js';


// shuffle the ordering in Single Answer, Multiple Answers, and Reorder questions
const shuffleQuestions = questions => {
    questions.forEach((question, index) => {
        if (question.type === 'Reorder' || question.type === 'MultipleAnswers' || question.type === 'SingleAnswer') {
            shuffle(question.options);
            questions[index] = question;
        }
    });
};

export const getSessions = async (req, res) => {
    const userId = req.user.id;

    try {
        // sort the practice sessions by date
        const sessions = await PracticeSessionModel.find({ "userId": userId }).sort({ date: -1 });

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

        // shuffle the options in each question
        shuffleQuestions(generatedQuestions);

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

        // shuffle the options in each question
        shuffleQuestions(generatedQuestions);

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

export const fetchPracticeQuestionChanged = async (req, res) => {
    try {
        const { sessionId, questionId } = req.query;

        if (!mongoose.Types.ObjectId.isValid(sessionId))
            res.status(200).send(false);

        const practiceSession = await PracticeSessionModel.findById(sessionId);
        const question = await QuestionModel.findById(questionId);

        const practiceQuestion = practiceSession.practiceQuestions.filter(q => q.question.toString() === questionId)[0];

        res.status(200).send(question.title !== practiceQuestion.title || question.type !== practiceQuestion.type || question.text !== practiceQuestion.text || JSON.stringify(question.type === 'Reorder' ? question.answer : question.answer.sort()) !== JSON.stringify(practiceQuestion.type === 'Reorder' ? practiceQuestion.answer : practiceQuestion.answer.sort()) || JSON.stringify(question.options.sort()) !== JSON.stringify(practiceQuestion.options.sort()))
    } catch (error) {
        console.log(error);
    }
}