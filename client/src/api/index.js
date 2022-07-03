import axios from 'axios';

axios.defaults.withCredentials = true;

const api = axios.create({ baseURL: 'http://localhost:5000' });

let token = '';

/**
 * Sets the bearer token in the Authorization field in header to be `token`
 * @param {String} token 
 */
export const setBearerToken = newToken => token = newToken;

api.interceptors.request.use(req => {
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// concepts
export const fetchConcepts = () => api.get(`/concepts`);
export const fetchConceptsBySearch = (query) => api.get(`/concepts/search?query=${query.search || ''}&tags=${query.tags}`);
export const createConcept = () => api.post(`/concepts`);
export const updateConcept = (conceptId, updatedConcept) => api.patch(`/concepts/${conceptId}`, updatedConcept);
export const deleteConcept = (conceptId) => api.delete(`/concepts/${conceptId}`);
export const likeConcept = (conceptId) => api.post(`/concepts/like/${conceptId}`);
export const dislikeConcept = (conceptId) => api.post(`/concepts/dislike/${conceptId}`);

// questions
export const fetchQuestions = (conceptId) => api.get(`/concepts/${conceptId}/questions`);
export const createQuestion = (conceptId) => api.post(`/concepts/${conceptId}/questions`);
export const updateQuestion = (conceptId, questionId, updatedQuestion) => api.patch(`/concepts/${conceptId}/questions/${questionId}`, updatedQuestion);
export const deleteQuestion = (conceptId, questionId) => api.delete(`/concepts/${conceptId}/questions/${questionId}`);
export const verifyQuestion = (conceptId, questionId) => api.get(`/concepts/${conceptId}/questions/verify/${questionId}`);

// comments
export const fetchComments = (conceptId) => api.get(`/concepts/${conceptId}/comments`);
export const createComment = (conceptId, newComment) => api.post(`/concepts/${conceptId}/comments`, newComment);
export const updateComment = (conceptId, commentId, updatedComment) => api.patch(`/concepts/${conceptId}/comments/${commentId}`, updatedComment);
export const deleteComment = (conceptId, commentId) => api.delete(`/concepts/${conceptId}/comments/${commentId}`);
export const likeComment = (conceptId, commentId) => api.post(`/concepts/${conceptId}/comments/like/${commentId}`);
export const dislikeComment = (conceptId, commentId) => api.post(`/concepts/${conceptId}/comments/dislike/${commentId}`);

// collections
export const fetchCollections = () => api.get(`/collections`);
export const createCollection = () => api.post(`/collections`);
export const deleteCollection = (collectionId) => api.delete(`/collections/${collectionId}`);
export const updateCollection = (collectionId, updatedCollection) => api.patch(`/collections/${collectionId}`, updatedCollection);
export const addToCollection = (collectionId, conceptId) => api.patch(`/collections/add/${collectionId}`, { conceptId });
export const removeFromCollection = (collectionId, conceptId) => api.patch(`/collections/remove/${collectionId}`, { conceptId });

// practice
export const generateConceptQuestions = (conceptId, questionsPerSession) => api.get(`/practice/generateConcept/${conceptId}?questionsPerSession=${questionsPerSession}`);
export const generateCollectionQuestions = (collectionId, questionsPerSession) => api.get(`/practice/generateCollection/${collectionId}?questionsPerSession=${questionsPerSession}`)
export const processSession = (title, inputs) => api.post(`/practice/process`, { title, inputs });
export const fetchPracticeSessions = () => api.get(`/practice/sessions`);
export const fetchPracticeQuestionChanged = (sessionId, questionId) => api.get(`/practice/checkChanged?sessionId=${sessionId}&questionId=${questionId}`);

// auth
export const generateToken = () => api.get(`/users/token`);
export const clearSession = () => api.post(`/users/clearsession`);
export const login = (loginInput) => api.post(`/users/login`, loginInput);
export const signUp = (signUpInput) => api.post(`/users/signup`, signUpInput);
export const updatePassword = (password, newPassword, confirmNewPassword) => api.post(`/users/password`, { password, newPassword, confirmNewPassword });

// user
export const getUser = (userId) => api.get(`/users/user/${userId}`);
export const fetchUsernames = () => api.get(`/users`);
export const fetchSettings = () => api.get(`/users/settings`);
export const updateSettings = (newSettings) => api.post(`/users/settings`, { newSettings });
export const updateUsername = (newUsername) => api.post(`/users/username`, { newUsername });