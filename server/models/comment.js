import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    concept: { type: mongoose.Types.ObjectId, ref: 'Concept' },
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    replyTo: { type: mongoose.Types.ObjectId, ref: 'Comment' },
    rootComment: { type: mongoose.Types.ObjectId, ref: 'Comment' },
    deleted: { type: Boolean, default: false },
    text: { type: String },
    createdAt: { type: Date },
    editedAt: { type: Date }
}, {
    versionKey: false
});

const CommentModel = mongoose.model('Comment', commentSchema);

export default CommentModel;