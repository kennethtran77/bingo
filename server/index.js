import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// import routers
import conceptsRouter from './routes/concept.js';
import questionsRouter from './routes/question.js';
import practiceRouter from './routes/practice.js';
import userRouter from './routes/user.js';
import collectionsRouter from './routes/collection.js';
import commentsRouter from './routes/comment.js';

// boilerplate
const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const signupKeyEnabled = process.env.SIGNUP_KEY_ENABLED;

// use services
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: FRONTEND_URL
}));

console.log(CONNECTION_URL);

// Setup child routers
conceptsRouter.use('/:conceptId/questions', questionsRouter);
conceptsRouter.use('/:conceptId/comments', commentsRouter);

// Setup routers
app.use('/concepts', conceptsRouter);
app.use('/practice', practiceRouter);
app.use('/users', userRouter);
app.use('/collections', collectionsRouter);

// Landing page
app.get('/', (req, res) => {
    res.send("Connected to API");
});

app.get('/signupkeyenabled', (req, res) => {
    res.send(signupKeyEnabled === 'true');
})

// Connect to database
mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);