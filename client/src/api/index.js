import axios from 'axios';

const api = axios.create({ baseURL: 'http://192.168.2.251:5000' });

// attach the JWT token to ea2ch request
api.interceptors.request.use(req => {
    if (localStorage.getItem('profile')) {
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
    
    return req;
});

// concepts
export const fetchConcepts = () => api.get(`/concepts`);
export const fetchConceptsBySearch = (query) => api.get(`/concepts/search?query=${query.search || ''}&tags=${query.tags}`);
export const createConcept = (newConcept) => api.post(`/concepts`, newConcept);
export const updateConcept = (conceptId, updatedConcept) => api.patch(`/concepts/${conceptId}`, updatedConcept);
export const deleteConcept = (conceptId) => api.delete(`/concepts/${conceptId}`);
export const likeConcept = (conceptId) => api.post(`/concepts/like/${conceptId}`);
export const dislikeConcept = (conceptId) => api.post(`/concepts/dislike/${conceptId}`);

// questions
export const fetchQuestions = (conceptId) => api.get(`/concepts/${conceptId}/questions`);
export const createQuestion = (conceptId, newQuestion) => api.post(`/concepts/${conceptId}/questions`, newQuestion);
export const updateQuestion = (conceptId, questionId, updatedQuestion) => api.patch(`/concepts/${conceptId}/questions/${questionId}`, updatedQuestion);
export const deleteQuestion = (conceptId, questionId) => api.delete(`/concepts/${conceptId}/questions/${questionId}`);
export const verifyQuestion = (conceptId, questionId) => api.get(`/concepts/${conceptId}/questions/verify/${questionId}`);

// comments
export const fetchComments = (conceptId) => api.get(`/concepts/${conceptId}/comments`);
export const createComment = (conceptId, newComment) => api.post(`/concepts/${conceptId}/comments`, newComment);
export const updateComment = (conceptId, commentId, updatedComment) => api.patch(`/concepts/${conceptId}/comments/${commentId}`, updatedComment);
export const deleteComment = (conceptId, commentId) => api.delete(`/concepts/${conceptId}/comments/${commentId}`);

// collections
export const fetchCollections = () => api.get(`/collections`);
export const createCollection = (collection) => api.post(`/collections`, { collection });
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
export const login = (loginInput) => api.post(`/users/login`, loginInput);
export const signUp = (signUpInput) => api.post(`/users/signup`, signUpInput);
export const updatePassword = (password, newPassword, confirmNewPassword) => api.post(`/users/password`, { password, newPassword, confirmNewPassword });

// user
export const getUser = (userId) => api.get(`/users/user/${userId}`);
export const fetchUsernames = () => api.get(`/users`);
export const fetchSettings = () => api.get(`/users/settings`);
export const updateSettings = (newSettings) => api.post(`/users/settings`, { newSettings });
export const updateUsername = (newUsername) => api.post(`/users/username`, { newUsername });