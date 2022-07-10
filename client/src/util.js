export const FILL_IN_THE_BLANK = 'FillInTheBlank';
export const SINGLE_ANSWER = 'SingleAnswer';
export const MULTIPLE_ANSWERS = 'MultipleAnswers';
export const REORDER = 'Reorder';

export const correctColour = '#5cbf15';
export const incorrectColour = '#f55142';

/**
 * Returns whether the the email is valid
 * @param {String} email 
 * @returns an object with keys: boolean success, string message
 */
 export const validateEmail = email => {
    if (email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        return { success: true };
    } else {
        return { success: false, message: 'Invalid email.' };
    }
};

/**
 * Returns whether the the username password is valid
 * @param {String} username 
 * @returns an object with keys: boolean success, string message
 */
 export const validateUsername = username => {
    // test for length
    if (username.length < 3)
        return { success: false, message: 'Username must contain at least 3 characters.' };

    if (username.length > 23)
        return { success: false, message: 'Username must contain less than 23 characters.' };

    // test for whitespace
    if (/\s/.test(username))
        return { success: false, message: 'Username cannot contain whitespace.' };
    
    return { success: true };
}

/**
 * Returns whether the the given password is strong enough
 * @param {String} password 
 * @returns an object with keys: boolean success, string message
 */
 export const validatePassword = password => {
    if (password.length < 6)
        return { success: false, message: 'Password must contain at least 6 characters.' };
    
    if (password.search(/[a-z]/i) < 0)
        return { success: false, message: 'Password must contain at least one letter.' };
    
    if (password.search(/[0-9]/) < 0)
        return { success: false, message: 'Password must contain at least one digit.' };
    
    return { success: true };
}

/**
 * Returns whether `password` and `confirmPassword` match, or true if `password` or `confirmPassword` are undefined
 * @param {String} password 
 * @param {String} confirmPassword 
 * @returns an object with keys: boolean success, string message
 */
export const validateConfirmPassword = (password, confirmPassword) => {
    if (!password || !confirmPassword || password === confirmPassword ) {
        return { success: true };
    }

    return { success: false, message: "Passwords do not match." };
};