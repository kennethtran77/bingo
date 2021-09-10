import React from 'react';

import CollectionsDisplayer from './CollectionsDisplayer';

const Collections = ({ userId }) => {
    return (
        <div>
            <h2>My Collections</h2>
            <CollectionsDisplayer userId={userId} />
        </div>
    );
};

export default Collections;