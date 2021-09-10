import mongoose from 'mongoose';

const settingsSchema = mongoose.Schema({
    questionsPerSession: Number
}, { versionKey: false });

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    username: String,
    settings: settingsSchema,
    sessionsCompleted: [{ type: mongoose.Types.ObjectId, ref: 'PracticeSession' }],
    collections: [{ type: mongoose.Types.ObjectId, ref: 'Collection' }]
}, { versionKey: false });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;