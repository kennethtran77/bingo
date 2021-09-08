import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

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

// questions
export const fetchQuestions = (conceptId) => api.get(`/concepts/${conceptId}/questions`);
export const createQuestion = (conceptId, newQuestion) => api.post(`/concepts/${conceptId}/questions`, newQuestion);
export const updateQuestion = (conceptId, questionId, updatedQuestion) => api.patch(`/concepts/${conceptId}/questions/${questionId}`, updatedQuestion);
export const deleteQuestion = (conceptId, questionId) => api.delete(`/concepts/${conceptId}/questions/${questionId}`);
export const verifyQuestion = (conceptId, questionId) => api.get(`/concepts/${conceptId}/questions/verify/${questionId}`);

// practice
export const generateQuestions = (conceptId, questionsPerSession) => api.get(`/practice/generate/${conceptId}?questionsPerSession=${questionsPerSession}`);
export const processSession = (title, inputs) => api.post(`/practice/process`, { title, inputs });
export const fetchPracticeSessions = () => api.get(`/practice/sessions`);

// auth
export const login = (loginInput) => api.post(`/users/login`, loginInput);
export const signUp = (signUpInput) => api.post(`/users/signup`, signUpInput);

// user
export const getUser = (userId) => api.get(`/users/user/${userId}`);
export const getUsername = (userId) => api.get(`/users/username/${userId}`);
export const fetchSettings = () => api.get(`/users/settings`);
export const updateSettings = (newSettings) => api.post(`/users/settings`, { newSettings });
export const updateUsername = (newUsername) => api.post(`/users/username`, { newUsername });