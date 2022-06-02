/**
 * Mutate this array by randomizing it using Fisher-Yates algorithm
 * @param {[]} arr the array to randomize
 */
export const shuffle = (arr) => {
    let lastIndex = arr.length - 1;

    while (lastIndex > 0) {
        // pick a random index from 0 to lastIndex
        let randomIndex = Math.floor(Math.random() * (lastIndex + 1));
        let temp = arr[randomIndex];
        arr[randomIndex] = arr[lastIndex];
        arr[lastIndex] = temp;
        lastIndex--;
    }
}

/**
 * Return whether this question is complete and usable in practice
 * @param {type: String, answer: [], options: []} question the question object that must contain at minimum `type`, `answer`, and `options` keys
 * @returns {Boolean} whether the question is correct
 */
export const verifyQuestion = (question) => {
    switch (question.type) {
        case 'FillInTheBlank':
            // check if answer has at least one blank with at least one non-empty element
            return Boolean(question.answer.find(item => Array.isArray(item) && item.length && item.every(blank => blank.length)));
        case 'MultipleAnswers':
            // check if answer has at least one answer, and that every answer is non-empty and belongs to options
            return question.answer.length && question.answer.every(answer => answer.length && question.options.includes(answer));
        case 'SingleAnswer':
            // check if answer has exactly one answer which is non-empty and belongs to options
            return question.answer.length === 1 && question.options.includes(question.answer[0]);
        case 'Reorder':
            // check if answer has at least one ordering, and that every correct ordering has the same elements as options
            return Boolean(question.answer.length && question.answer.every(ordering => Array.isArray(ordering) && JSON.stringify([...ordering].sort()) === JSON.stringify([...question.options].sort())));
        default:
            return false;
    }
}

/**
 * Return whether the input is correct for this question
 * @param {type: String, answer: [], options: []} question 
 * @param {[]} input 
 * @returns {Boolean} whether the given input is correct for the given question
 */
export const verifyAnswer = (question, input) => {
    switch (question.type) {
        case 'FillInTheBlank':
            // return True iff each the value entered in each field is one of the possible correct answers
            return Boolean(input.every((blank, index) => blank === null || question.answer[index].includes(blank)));
        case 'MultipleAnswers':
            return JSON.stringify([...question.answer].sort()) === JSON.stringify([...input].sort());
        case 'Reorder':
            // return True iff the given ordering matches at least one correct ordering
            return Boolean(question.answer.some(correctOrdering => JSON.stringify(correctOrdering) === JSON.stringify(input)))
        case 'SingleAnswer':
            return JSON.stringify(question.answer) === JSON.stringify(input);
        default:
            return false;
    }
}