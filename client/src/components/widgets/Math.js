import React, { useState } from 'react';

import { MathComponent } from 'mathjax-react';

const Math = ({ text, enabled, setError, ignoreError = false }) => {
    const [timer, setTimer] = useState(null);

    return (!enabled || !text) ? text : (
        <MathComponent
            tex={text}
            display={false}
            onError={ignoreError ? () => {} : string => {
                setError(string);

                if (timer) {
                    clearTimeout(timer);
                    setTimer(setTimeout(() => {
                        setError('');
                        setTimer(null);
                    }, 2500));
                    return;
                }

                setTimer(setTimeout(() => {
                    setError('');
                    setTimer(null);
                }, 2500));
            }}
        />
    );
};

export default Math;