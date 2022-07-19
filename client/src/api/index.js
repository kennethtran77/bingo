import axios from 'axios';

axios.defaults.withCredentials = true;

/**
 * Returns an object with functions to API calls
 * @returns an object with functions to API calls
 */
const getApi = (baseURL) => {
    const api = axios.create({ baseURL });
    let token = '';
    
    api.interceptors.request.use(req => {
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
        return req;
    });

    return {
        /**
         * Sets the bearer token in the Authorization field in header to be `token`
         * @param {String} token 
         */
        setBearerToken: newToken => token = newToken,
        fetchSignupKeyEnabled: () => api.get(`/signupkeyenabled`),

        // concepts
        fetchConcepts: () => api.get(`/concepts`),
        fetchConceptsBySearch: (query) => api.get(`/concepts/search?query=${query.search || ''}&tags=${query.tags}`),
        createConcept: () => api.post(`/concepts`),
        updateConcept: (conceptId, updatedConcept) => api.patch(`/concepts/${conceptId}`, updatedConcept),
        deleteConcept: (conceptId) => api.delete(`/concepts/${conceptId}`),
        likeConcept: (conceptId) => api.post(`/concepts/like/${conceptId}`),
        dislikeConcept: (conceptId) => api.post(`/concepts/dislike/${conceptId}`),

        // questions
        fetchQuestions: (conceptId) => api.get(`/concepts/${conceptId}/questions`),
        createQuestion: (conceptId) => api.post(`/concepts/${conceptId}/questions`),
        updateQuestion: (conceptId, questionId, updatedQuestion) => api.patch(`/concepts/${conceptId}/questions/${questionId}`, updatedQuestion),
        deleteQuestion: (conceptId, questionId) => api.delete(`/concepts/${conceptId}/questions/${questionId}`),
        verifyQuestion: (conceptId, questionId) => api.get(`/concepts/${conceptId}/questions/verify/${questionId}`),

        // comments
        fetchComments: (conceptId) => api.get(`/concepts/${conceptId}/comments`),
        createComment: (conceptId, newComment) => api.post(`/concepts/${conceptId}/comments`, newComment),
        updateComment: (conceptId, commentId, updatedComment) => api.patch(`/concepts/${conceptId}/comments/${commentId}`, updatedComment),
        deleteComment: (conceptId, commentId) => api.delete(`/concepts/${conceptId}/comments/${commentId}`),
        likeComment: (conceptId, commentId) => api.post(`/concepts/${conceptId}/comments/like/${commentId}`),
        dislikeComment: (conceptId, commentId) => api.post(`/concepts/${conceptId}/comments/dislike/${commentId}`),

        // collections
        fetchCollections: () => api.get(`/collections`),
        createCollection: () => api.post(`/collections`),
        deleteCollection: (collectionId) => api.delete(`/collections/${collectionId}`),
        updateCollection: (collectionId, updatedCollection) => api.patch(`/collections/${collectionId}`, updatedCollection),
        addToCollection: (collectionId, conceptId) => api.patch(`/collections/add/${collectionId}`, { conceptId }),
        removeFromCollection: (collectionId, conceptId) => api.patch(`/collections/remove/${collectionId}`, { conceptId }),

        // practice
        generateConceptQuestions: (conceptId, questionsPerSession) => api.get(`/practice/generateConcept/${conceptId}?questionsPerSession=${questionsPerSession}`),
        generateCollectionQuestions: (collectionId, questionsPerSession) => api.get(`/practice/generateCollection/${collectionId}?questionsPerSession=${questionsPerSession}`),
        processSession: (title, inputs) => api.post(`/practice/process`, { title, inputs }),
        fetchPracticeSessions: () => api.get(`/practice/sessions`),
        fetchPracticeQuestionsChanged: (sessionId, questionId) => api.get(`/practice/checkChanged?sessionId=${sessionId}&questionId=${questionId}`),

        // auth
        generateToken: () => api.get(`/users/token`),
        clearSession: () => api.post(`/users/clearsession`),
        login: (loginInput) => api.post(`/users/login`, loginInput),
        signUp: (signUpInput) => api.post(`/users/signup`, signUpInput),
        updatePassword: (password, newPassword, confirmNewPassword) => api.post(`/users/password`, { password, newPassword, confirmNewPassword }),

        // user
        getUser: (userId) => api.get(`/users/user/${userId}`),
        fetchUsernames: () => api.get(`/users`),
        fetchSettings: () => api.get(`/users/settings`),
        updateSettings: (newSettings) => api.post(`/users/settings`, { newSettings }),
        updateUsername: (newUsername) => api.post(`/users/username`, { newUsername }),
    };
};

export default getApi;