import UserModel from '../models/user.js';
import ConceptModel from '../models/concept.js';
import QuestionModel from '../models/question.js';
import PracticeSessionModel from '../models/practiceSession.js';
import CollectionModel from '../models/collection.js';

import { shuffle, verifyQuestion, verifyAnswer } from '../utils.js';


// shuffle the ordering in Single Answer, Multiple Answers, and Reorder questions
const shuffleQuestionsOptions = questions => {
    questions.forEach((question) => {
        if (question.type === 'Reorder' || question.type === 'MultipleAnswers' || question.type === 'SingleAnswer') {
            shuffle(question.options);
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
            .filter(question => verifyQuestion(question))  // filter out incomplete/invalid questions
            .slice(0, Math.min(questionsPerSession, questions.length));  // do not keep more than `questionsPerSession` questions

        // shuffle the options in each question
        shuffleQuestionsOptions(generatedQuestions);

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
            .filter(question => verifyQuestion(question))  // filter out incomplete/invalid questions
            .slice(0, Math.min(questionsPerSession, questions.length));  // do not keep more than `questionsPerSession` questions

        // shuffle the options in each question
        shuffleQuestionsOptions(generatedQuestions);

        res.json(generatedQuestions);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
}

export const processSession = async (req, res) => {
    const { title, inputs } = req.body;
    const userId = req.user.id;

    try {
        // fetch the user
        const user = await UserModel.findById(userId);

        if (!user)
            return res.status(404).send(`No user found with id ${userId}`);

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
            score,
            date: Date.now()
        }).save();

        user.sessionsCompleted.push(practiceSession);
        await user.save();

        res.status(200).send(practiceSession);
    } catch (error) {
        console.log(error);
        res.status(404).send({ message: error.message });
    }
};

/**
 * Returns an array of booleans indicating whether the questions in a practice session have changed since the session was completed.
 * @param {String} sessionId 
 * @returns an array of booleans with length of the practice session's number of questions 
 */
export const fetchPracticeQuestionChanged = async (req, res) => {
    try {
        const { sessionId } = req.query;

        const practiceSession = await PracticeSessionModel.findById(sessionId);

        if (!practiceSession)
            return res.status(200).send(null);

        const changed = [];

        for (let i = 0; i < practiceSession.practiceQuestions.length; i++) {
            // get the practice question from the practice session
            const practiceQuestion = practiceSession.practiceQuestions[i];
            
            // get the newest version of the question with id `questionId`
            const currentQuestion = await QuestionModel.findById(practiceQuestion.question._id);

            // if the question was deleted, then mark it as changed automatically
            if (!currentQuestion) {
                changed.push(true);
                continue;
            }

            const titleChanged = currentQuestion.title !== practiceQuestion.title;
            const typeChanged = currentQuestion.type !== practiceQuestion.type;
            const textChanged = currentQuestion.text !== practiceQuestion.text;
            const optionsChanged = JSON.stringify([...currentQuestion.options].sort()) !== JSON.stringify([...practiceQuestion.options].sort());
            const answerChanged = currentQuestion.type === practiceQuestion.type && JSON.stringify(currentQuestion.answer) !== JSON.stringify(practiceQuestion.answer);

            changed.push(titleChanged || typeChanged || textChanged || optionsChanged || answerChanged);
        }

        res.status(200).send(changed);
    } catch (error) {
        console.log(error);
    }
}