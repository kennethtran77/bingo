import React from 'react';

import PracticeSessionsDisplayer from './PracticeSessionsDisplayer';
import ConceptsDisplayer from '../../widgets/ConceptsDisplayer';

const Home = ({ userId }) => {
    return (
        <>
            <div>
                <h2>My Concepts</h2>
                <ConceptsDisplayer displayAll={false} userId={userId} />
            </div>
            <div>
                <h2>Completed Practice Sessions</h2>
                <PracticeSessionsDisplayer userId={userId} />
            </div>
        </>
    );
}

export default Home;