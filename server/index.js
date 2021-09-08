import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import conceptsRouter from './routes/concept.js';
import questionsRouter from './routes/question.js';
import practiceRouter from './routes/practice.js';
import userRouter from './routes/user.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;
const CONNECTION_URL = process.env.CONNECTION_URL;

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

console.log(CONNECTION_URL);

conceptsRouter.use('/:conceptId/questions', questionsRouter);

app.use('/concepts', conceptsRouter);
app.use('/practice', practiceRouter);
app.use('/users', userRouter);

app.get('/', (req, res) => {
    res.send("Connected to API");
});

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);