import mongoose from 'mongoose';

const conceptSchema = mongoose.Schema({
    title: String,
    creator: { type: mongoose.Types.ObjectId, ref: 'User' },
    text: String,
    tags: [String],
    public: Boolean,
    questions: [{ type: mongoose.Types.ObjectId, ref: 'Question' }],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    comments: [String]
}, { versionKey: false });

const ConceptModel = mongoose.model('Concept', conceptSchema);

export default ConceptModel;