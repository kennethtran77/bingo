import mongoose from 'mongoose';

const collectionSchema = mongoose.Schema({
    creator: { type: mongoose.Types.ObjectId, ref: 'User' },
    title: { type: String },
    concepts: [{ type: mongoose.Types.ObjectId, ref: 'Concept' }],
    tags: { type: [String] }
});

const CollectionModel = mongoose.model('Collection', collectionSchema);

export default CollectionModel;