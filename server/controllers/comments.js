import CommentModel from '../models/comment.js';
import ConceptModel from '../models/concept.js';


export const getComments = async (req, res) => {
    const { conceptId } = req.params;

    try {
        const concept = await ConceptModel.findById(conceptId);

        // Check to see if the concept with given id exists
        if (!concept)
            return res.status(404).send(`No concept found with id ${conceptId}`);

        const ids = concept.comments;

        const comments = await CommentModel.find({ "_id": { "$in": ids } });

        res.status(200).json(comments);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createComment = async (req, res) => {
    const { conceptId } = req.params;
    const comment = req.body;

    try {
        // Check to see if the concept with given id exists
        if (!concept)
            return res.status(404).send(`No concept found with id ${conceptId}`);

        // fetch the concept document
        const concept = await ConceptModel.findById(conceptId);

        // input validation
        if (comment.text.length === 0)
            return res.status(400).send({ message: 'Comment must not be empty.' });

        // create the new comment document
        const newComment = await new CommentModel({ ...comment, author: req.user.id }).save();

        // add the desired question
        concept.comments.push(newComment);

        await concept.save();

        res.status(201).json(newComment);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteComment = async (req, res) => {
    const { conceptId, commentId } = req.params;

    // Check to see if the concept with given id exists
    if (!await ConceptModel.exists(conceptId))
        return res.status(404).send(`No concept found with id ${conceptId}`);

    const comment = await CommentModel.findById(commentId);

    // Check to see if the comment with given id exists
    if (!comment)
        return res.status(404).send(`No comment found with id ${commentId}`);

    if (req.user.id !== comment.author.toString())
        return res.status(403).json({ message: 'Unauthorized action' });
    
    await CommentModel.findByIdAndRemove(commentId);

    res.json({ message: 'Comment deleted successfully' });
};

export const updateComment = async (req, res) => {
    const { conceptId, commentId } = req.params;
    const { text } = req.body;

    // Check to see if the concept with given id exists
    if (!await ConceptModel.exists(conceptId))
        return res.status(404).send(`No concept found with id ${conceptId}`);

    const comment = await CommentModel.findById(commentId);

    // Check to see if the comment with given id exists
    if (!comment)
        return res.status(404).send(`No comment found with id ${commentId}`);

    if (req.user.id !== comment.author.toString())
        return res.status(403).json({ message: 'Unauthorized action' });

    // input validation
    if (text.length === 0) {
        return res.status(400).send({ message: 'Comment must not be empty.' });
    }

    // Update comment text
    comment.text = text;

    await comment.save();

    res.status(200).json(comment);
}