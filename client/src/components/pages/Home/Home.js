import React from 'react';

import { useSelector } from 'react-redux';

import PracticeSessionsDisplayer from './PracticeSessionsDisplayer';
import ConceptsDisplayer from '../../widgets/ConceptsDisplayer';

const Home = ({ userId }) => {
    const { concepts, isLoading } = useSelector(state => state.conceptsSlice);

    return (
        <>
            <div>
                <h2>My Concepts</h2>
                <ConceptsDisplayer
                    userId={userId}
                    showCreator={false}
                    concepts={concepts.filter(concept => concept.creator === String(userId))}
                    isLoading={isLoading}
                />
            </div>
            <div>
                <h2>Completed Practice Sessions</h2>
                <PracticeSessionsDisplayer userId={userId} />
            </div>
        </>
    );
}

export default Home;