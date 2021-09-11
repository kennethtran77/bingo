import mongoose from 'mongoose';

const questionSchema = mongoose.Schema({
    concept: { type: mongoose.Types.ObjectId, ref: 'Concept' },
    type: { type: String, required: true },
    title: { type: String },
    text: { type: String },
    answer: { type: [] },
    options: { type: [String] },
    textMathjaxEnabled: { type: Boolean },
    optionsMathjaxEnabled: { type: Boolean }
}, { versionKey: false });

const QuestionModel = mongoose.model('Question', questionSchema);

export default QuestionModel;