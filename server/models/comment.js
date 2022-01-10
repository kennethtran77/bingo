import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    concept: { type: mongoose.Types.ObjectId, ref: 'Concept' },
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    text: { type: String }
}, {
    versionKey: false,
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const CommentModel = mongoose.model('Comment', commentSchema);

export default CommentModel;