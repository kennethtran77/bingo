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
        // fetch the concept document
        const concept = await ConceptModel.findById(conceptId);

        // Check to see if the concept with given id exists
        if (!concept)
            return res.status(404).send(`No concept found with id ${conceptId}`);

        // input validation
        if (!comment.text.length)
            return res.status(400).send({ message: 'Comment must not be empty.' });

        let replyTo, rootComment;

        // Check if the comment is a reply to another comment
        if (comment.replyTo) {
            replyTo = await CommentModel.findById(comment.replyTo);

            if (!replyTo)
                return res.status(404).send(`No comment found with id ${comment.replyTo}`);

            // get the root comment
            rootComment = replyTo.rootComment;
        }

        // create the new comment document
        const newComment = await new CommentModel({
            ...comment,
            author: req.user.id,
            createdAt: Date.now(),
            editedAt: Date.now(),
            replyTo,
            rootComment
        }).save();

        // make new comments be their own roots
        if (!newComment.rootComment)
            newComment.rootComment = newComment._id;

        await newComment.save();

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
    if (!await ConceptModel.findById(conceptId))
        return res.status(404).send(`No concept found with id ${conceptId}`);

    const comment = await CommentModel.findById(commentId);

    // Check to see if the comment with given id exists
    if (!comment)
        return res.status(404).send(`No comment found with id ${commentId}`);

    if (req.user.id !== comment.author.toString())
        return res.status(403).json({ message: 'Unauthorized action' });
    
    if (!CommentModel.findOne({ "replyTo": comment })) {
        await comment.delete();
    } else {
        comment.text = 'This comment was deleted.';
        comment.deleted = true;
        await comment.save();
    }

    res.json({ message: 'Comment deleted successfully' });
};

export const updateComment = async (req, res) => {
    const { conceptId, commentId } = req.params;
    const { text } = req.body;

    // Check to see if the concept with given id exists
    if (!await ConceptModel.findById(conceptId))
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
    comment.editedAt = Date.now();

    await comment.save();

    res.status(200).json(comment);
}


export const likeComment = async (req, res) => {
    const { commentId } = req.params;

    const comment = await CommentModel.findById(commentId);

    if (!comment)
        return res.status(404).json({ message: `No comment found with id ${commentId}` });

    const userId = req.user.id;

    // Like the comment if not already liked
    if (!comment.likes.includes(userId)) {
        comment.likes = [...comment.likes, userId];

        // Remove dislike if the user already disliked
        if (comment.dislikes.includes(userId)) {
            comment.dislikes = comment.dislikes.filter(u => u.toString() !== userId);
        }
    } else { // Unlike the comment if already liked
        comment.likes = comment.likes.filter(u => u.toString() !== userId);
    }

    await comment.save();

    res.status(200).json(comment);
}

export const dislikeComment = async (req, res) => {
    const { commentId } = req.params;

    const comment = await CommentModel.findById(commentId);

    if (!comment)
        return res.status(404).json({ message: `No comment found with id ${commentId}` });

    const userId = req.user.id;

    // Dislike the comment if not already disliked
    if (!comment.dislikes.includes(userId)) {
        comment.dislikes = [...comment.dislikes, userId];

        // Remove like if user already liked
        if (comment.likes.includes(userId)) {
            comment.likes = comment.likes.filter(u => u.toString() !== userId);
        }
    } else { // Un-dislike the comment if already disliked
        comment.dislikes = comment.dislikes.filter(u => u.toString() !== userId);
    }

    await comment.save();

    res.status(200).json(comment);
}