import mongoose from 'mongoose';

const conceptSchema = mongoose.Schema({
    title: String,
    creator: String,
    text: String,
    tags: [String],
    public: Boolean,
    questions: [{ type: mongoose.Types.ObjectId, ref: 'Question' }]
}, { versionKey: false });

const ConceptModel = mongoose.model('Concept', conceptSchema);

export default ConceptModel;