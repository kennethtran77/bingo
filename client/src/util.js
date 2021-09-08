export const verifyQuestion = (question) => {
    switch (question.type) {
        case 'FillInTheBlank':
            // check if answer has at least one blank with at least one non-empty element 
            return Boolean(question.answer.find(item => Array.isArray(item) && item.length && item.every(blank => blank.length)));
        case 'MultipleAnswers':
        case 'Reorder':
        case 'SingleAnswer':
            // check if answers has at least one answer, and that every answer is non-empty
            return question.answer.length && question.answer.every(item => item.length);
        default:
            return false;
    }
}

/**
 * Return whether the input is correct for this question
 * @param {type: String, answer: [], options: []} question 
 * @param {[]} input 
 * @returns {Boolean}
 */
 export const verifyAnswer = (question, input) => {
    switch (question.type) {
        case 'FillInTheBlank':
            return Boolean(input.every((blank, index) => blank === null || question.answer[index].includes(blank)));
        case 'MultipleAnswers':
            return JSON.stringify(question.answer.sort()) === JSON.stringify(input.sort());
        case 'Reorder':
        case 'SingleAnswer':
            return JSON.stringify(question.answer) === JSON.stringify(input);
        default:
            return false;
    }
}

export const correctColour = '#5cbf15';
export const incorrectColour = '#f55142';