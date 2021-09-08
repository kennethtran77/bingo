import mongoose from 'mongoose';

// the question might have changed after this practice session
export const practiceQuestionSchema = mongoose.Schema({
    concept: { type: mongoose.Types.ObjectId, ref: 'Concept' },
    question: { type: mongoose.Types.ObjectId, ref: 'Question' },
    type: { type: String, required: true },
    title: { type: String, required: true },
    text: { type: String },
    options: { type: [String] },
    textMathjaxEnabled: { type: Boolean },
    optionsMathjaxEnabled: { type: Boolean },
    input: { type: [] },
    answer: { type: [] }
}, { versionKey: false });

export const practiceSessionSchema = mongoose.Schema({
    userId: String,
    title: String,
    score: Number,
    date: { type: Date, default: new Date() },
    practiceQuestions: [practiceQuestionSchema]
}, { versionKey: false });

const PracticeSessionModel = mongoose.model('PracticeSession', practiceSessionSchema);

export default PracticeSessionModel;