import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import LikeDislike from '../../widgets/LikeDislike';
import Comments from './Comments';
import LoadingSpinner from '../../widgets/LoadingSpinner';

import { likeConcept, dislikeConcept, deleteConcept } from '../../../actions/concepts';
import Modal from '../../widgets/Modal';
import ConceptOptions from '../../widgets/ConceptOptions';
import Button from '../../widgets/Button';

const ViewConcept = ({ userId }) => {
    const { conceptId } = useParams();

    const [alertOpen, setAlertOpen] = useState(false);

    const dispatch = useDispatch();

    // fetch from store
    const { concepts, isLoading: isConceptLoading } = useSelector(state => state.conceptsSlice);
    const { users, isLoading: isUserLoading } = useSelector(state => state.usersSlice);

    const concept = concepts.find(c => c._id === conceptId);

    // check if concept exists
    if (isConceptLoading && !concept)
        return <LoadingSpinner />;

    if (!isConceptLoading && !concept)
        return <Navigate to="/"/>;

    const user = users.find(u => u._id === concept.creator);

    // check if user exists
    if (isUserLoading && !user)
        return <LoadingSpinner />;

    if (!isUserLoading && !user)
        return <Navigate to="/"/>;

    return (
        <>
            <Modal
                active={alertOpen}
                setActive={setAlertOpen}
            >
                <p>Are you sure want to delete <strong>{concept.title}</strong>?</p>
                <div className="right-flex gap">
                    <Button text="Delete" onClick={() => dispatch(deleteConcept(concept._id))} background />
                    <Button text="Cancel" onClick={() => setAlertOpen(false)} />
                </div>
            </Modal>

            <div className="container">
                <h1>{ concept.title }</h1>
                <h3>by <strong>{user.username}</strong></h3>
                <hr />
                <Latex>{concept.text}</Latex>
            </div>
            <div className="container">
                <div className="space-between">
                    <LikeDislike
                        userId={userId}
                        likes={concept.likes}
                        dislikes={concept.dislikes}
                        like={() => dispatch(likeConcept(concept._id))}
                        dislike={() => dispatch(dislikeConcept(concept._id))}
                    />
                    <ConceptOptions userId={userId} concept={concept} setToDelete={() => setAlertOpen(true)} />
                </div>
                <hr />
                <Comments concept={concept} userId={userId} />
            </div>
        </>
    );
}

export default ViewConcept;