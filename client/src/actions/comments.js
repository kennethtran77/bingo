// Action handlers

const setTimedMessage = (message, colour, interval) => (dispatch, getState, api) => {
    dispatch({ type: 'comments/setMessage', payload: { content: message, colour }});

    let timer = getState().commentsSlice.messageTimer;

    // reset the timer if it already exists
    if (timer) {
        clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
        dispatch({ type: 'comments/setMessage', payload: '' });
        dispatch({ type: 'comments/setMessageTimer', payload: null });
    }, interval);

    dispatch({ type: 'comments/setMessageTimer', payload: newTimer });
}

export const fetchComments = (concept) => async (dispatch, getState, api) => {
    try {
        dispatch({ type: 'comments/startLoading' });
        const { data } = await api.fetchComments(concept._id);

        dispatch({
            type: 'comments/fetchAll',
            payload: data.concat(getState().commentsSlice.comments)  // concatenate concept comments with existing comments
        });

        // --- update concepts
        dispatch({ type: 'concepts/startLoading' });
        dispatch({
            type: 'concepts/update',
            payload: { ...concept, comments: data }
        })
        dispatch({ type: 'concepts/stopLoading' });
        // ---

        dispatch({ type: 'comments/stopLoading' });
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'comments/stopLoading' });
    }
};

export const createComment = (concept, newComment) => async (dispatch, getState, api) => {
    try {
        dispatch({ type: 'comments/startLoading' });
        // data is the new concept object with author and id keys
        const { data } = await api.createComment(concept._id, newComment);
        dispatch({
            type: 'comments/create',
            payload: data
        });

        // --- update concept
        dispatch({ type: 'concepts/startLoading' });
        dispatch({
            type: 'concepts/update',
            payload: { ...concept, comments: [...concept.comments, data._id ]}
        })
        dispatch({ type: 'concepts/stopLoading' });
        // ---

        dispatch({ type: 'comments/stopLoading' });
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'comments/stopLoading' });
    }
};

export const updateComment = (concept, commentId, updatedComment) => async (dispatch, getState, api) => {
    try {
        dispatch({ type: 'comments/startLoading' });
        const { data } = await api.updateComment(concept._id, commentId, updatedComment);
        dispatch({
            type: 'comments/update',
            payload: data
        });

        dispatch({ type: 'comments/stopLoading' });
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'comments/stopLoading' });
    }
};

export const deleteComment = (concept, commentId) => async (dispatch, getState, api) => {
    try {
        dispatch({ type: 'comments/startLoading' });
        const { data } = await api.deleteComment(concept._id, commentId);
        
        if (data.completelyDeleted) {
            dispatch({
                type: 'comments/delete',
                payload: commentId
            });

            // --- update concept
            dispatch({ type: 'concepts/startLoading' });
            dispatch({
                type: 'concepts/update',
                payload: { ...concept, comments: concept.comments.filter(comment => comment !== commentId) }
            });
            dispatch({ type: 'concepts/stopLoading' });
            // ---
        } else {
            dispatch({
                type: 'comments/update',
                payload: data.updatedComment
            });
        }

        dispatch({ type: 'comments/stopLoading' });
    } catch (error) {
        dispatch(setTimedMessage(error.response.data.message, 'red', 2500));
        dispatch({ type: 'comments/stopLoading' });
    }
};

export const likeComment = (conceptId, commentId) => async (dispatch, getState, api) => {
    try {
        // data is the concept object with the updated likes
        const { data } = await api.likeComment(conceptId, commentId);
        dispatch({ type: 'comments/update', payload: data });
    } catch (error) {
        console.log(error.message);
    }
}

export const dislikeComment = (conceptId, commentId) => async (dispatch, getState, api) => {
    try {
        // data is the concept object with the updated dislikes
        const { data } = await api.dislikeComment(conceptId, commentId);
        dispatch({ type: 'comments/update', payload: data });
    } catch (error) {
        console.log(error.message);
    }
}