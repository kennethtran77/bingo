import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import LikeDislike from '../../widgets/LikeDislike';
import Comments from './Comments';
import LoadingSpinner from '../../widgets/LoadingSpinner';

import { likeConcept, dislikeConcept } from '../../../actions/concepts';

const ViewConcept = ({ userId }) => {
    const { conceptId } = useParams();

    const dispatch = useDispatch();

    // fetch concept object from store
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);
    const concept = concepts.find(c => c._id === conceptId);

    // fetch user object from store
    const { users } = useSelector(state => state.usersSlice);
    const user = users.find(u => u._id === concept.creator);

    if (!user || (isLoading && !concept))
        return <LoadingSpinner />;

    // If we finished loading but couldn't find the concept or user, return to homepage
    if ((!concept || !user) && !isLoading)
        return <Navigate to="/"/>;

    return (
        <>
            <div className="container">
                <h1>{ concept.title }</h1>
                <h3>by <strong>{user.username}</strong></h3>
                <hr />
                <Latex>{concept.text}</Latex>
            </div>
            <div className="container">
                <LikeDislike
                    userId={userId}
                    likes={concept.likes}
                    dislikes={concept.dislikes}
                    like={() => dispatch(likeConcept(concept._id))}
                    dislike={() => dispatch(dislikeConcept(concept._id))}
                />
                <hr />
                <Comments concept={concept} userId={userId} />
            </div>
        </>
    );
}

export default ViewConcept;