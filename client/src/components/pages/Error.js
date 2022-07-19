import React from 'react';
import Button from '../widgets/Button';

import HomeIcon from '@mui/icons-material/Home';

const Error = () => {
    return (
        <div className="center-flex max-view">
            <div>
                <h1>404</h1>
                <h2>The page you are looking for does not exist.</h2>
                <Button link="/" text="Go Home" background Icon={<HomeIcon />} />
            </div>
        </div>
    );
}

export default Error;