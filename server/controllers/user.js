import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModel from '../models/user.js';

dotenv.config();

const secret = process.env.SECRET;
const signupKeyEnabled = process.env.SIGNUP_KEY_ENABLED;
const signupKey = process.env.SIGNUP_KEY;

/**
 * Returns whether the the email is valid
 * @param {String} username 
 * @returns an object with keys: boolean success, string message
 */
const validateEmail = email => {
    if (email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        return { success: true, message: 'Valid email.' };
    } else {
        return { success: false, message: 'Invalid email.' };
    }
};

/**
 * Returns whether the the username is valid
 * @param {String} username 
 * @returns an object with keys: boolean success, string message
 */
 const validateUsername = username => {
    // test for length
    if (username.length < 3)
        return { success: false, message: 'Username must contain at least 3 characters.' };

    if (username.length > 23)
        return { success: false, message: 'Username must contain less than 23 characters.' };

    // test for whitespace
    if (/\s/.test(username))
        return { success: false, message: 'Username cannot contain whitespace.' };
    
    return { success: true, message: "Valid username." };
}

/**
 * Returns whether the the given password is strong enough
 * @param {String} password 
 * @returns an object with keys: boolean success, string message
 */
 const validatePassword = password => {
    if (password.length < 6)
        return { success: false, message: 'Password must contain at least 6 characters.' };
    
    if (password.search(/[a-z]/i) < 0)
        return { success: false, message: 'Password must contain at least one letter.' };
    
    if (password.search(/[0-9]/) < 0)
        return { success: false, message: 'Password must contain at least one digit.' };
    
    return { success: true, message: "Valid password." };
}

// Generates a new jwt token using refresh token in httpOnly cookie 
export const generateToken = async (req, res) => {
    const token = jwt.sign({ id: req.user.id }, secret, { expiresIn: '0.25h' });
    return res.status(200).json({ token, success: true });
}

// Remove the refresh token cookie
export const clearSession = async (req, res) => {
    res.clearCookie('refreshToken', { path: '/' });
    res.send('Logged out.');
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // check inputs
        if (!email || !password)
        return res.status(400).json({ success: false, message: 'Please fill in all inputs.' });

        // check if account exists
        const user = await UserModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ success: false, message: 'No account with this email was found.' });
        }

        // check if password is correct
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ success: false, message: 'Incorrect password.' });
        }

        // sign a token and send it through cookies
        const hours = 6;
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: `${hours}h` });

        res.cookie('refreshToken', token, {
            expires: new Date(Date.now() + (hours * 60 * 60 * 1000)),
            secure: true,
            sameSite: 'strict',
            httpOnly: true,
        });
        res.status(200).send({ success: true, token });
    } catch (error) {
        console.log(error);

        res.status(500).json({ success: false, message: 'Something went wrong...' });
    }
}

export const fetchSignupKeyEnabled = async (req, res) => {
    return res.status(200).json()
}

export const signUp = async (req, res) => {
    const { email, password, confirmPassword, username, key } = req.body;

    try {
        // check inputs
        if (!email || !password || !confirmPassword || !username)
            return res.status(400).json({ message: 'Please fill in all inputs.' });

        if (signupKeyEnabled && (!key || key !== signupKey))
            return res.status(400).json({ success: false, message: 'Incorrect signup key.' });

        // validate email
        const validEmail = validateEmail(email);
            
        if (!validEmail.success)
            return res.status(400).json({ success: false, message: validEmail.message });

        // validate password
        const validPassword = validatePassword(password);

        if (!validPassword.success)
            return res.status(400).json({ success: false, message: validPassword.message });

        if (password !== confirmPassword)
            return res.status(400).json({ success: false, message: 'Passwords do not match.' });

        // validate username
        const validUsername = validateUsername(username);

        if (!validUsername.success)
            return res.status(400).json({ success: false, message: validUsername.message });

        // check if account exists
        const user = await UserModel.findOne({ email: email.toLowerCase() });

        if (user)
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await UserModel.create({
            email,
            password: hashedPassword,
            username,
            settings: {
                questionsPerSession: 10
            },
            sessionsCompleted: []
        });

        const hours = 6;
        const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: `${hours}h` });

        res.cookie('refreshToken', token, {
            expires: new Date(Date.now() + (hours * 60 * 60 * 1000)),
            secure: true,
            sameSite: 'strict',
            httpOnly: true
        });
        res.status(200).send({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Something went wrong...' });
    }
}

export const resetPassword = async (req, res) => {
    const { password, newPassword, confirmNewPassword } = req.body;

    try {
        if (!password || !newPassword || !confirmNewPassword)
            return res.status(400).json({ message: 'Please fill in all inputs.' });
        
        const user = await UserModel.findById(req.user.id);
    
        // check if password is correct
        if (!await bcrypt.compare(password, user.password))
            return res.status(400).json({ message: 'Incorrect password.' });

        if (newPassword !== confirmNewPassword)
            return res.status(400).json({ message: 'The two passwords do not match.' });

        // validate password
        const validPassword = validatePassword(newPassword);

        if (!validPassword.success)
            return res.status(400).json({ message: validPassword.message });

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;

        await user.save();
        res.status(201).json({ message: 'Password successfully changed. '});
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong...' });
    }
}

export const getUser = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const user = await UserModel.findById(userId);

        if (!user)
            return res.status(404).json({ message: 'No user with this id was found' });

        if (req.user.id !== userId)
            return res.status(403).json({ message: 'Unauthorized action' });

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getUsernames = async (req, res) => {
    try {
        const users = await UserModel.find({}, '_id username');
        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getSettings = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);

        if (!user)
            return res.status(404).json({ message: 'No account with this username was found' });

        res.status(200).json(user.settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateSettings = async (req, res) => {
    const { newSettings } = req.body;

    try {
        const user = await UserModel.findById(req.user.id);

        if (!user)
            return res.status(404).json({ message: 'No account with this id was found' });

        // verify input
        if (newSettings.questionsPerSession < 1 || newSettings.questionsPerSession > 10)
            return res.status(400).json({ message: 'Questions per session must be between 1 and 10.' })

        user.settings.questionsPerSession = newSettings.questionsPerSession;

        await user.save();
        res.status(201).json({ message: 'Settings updated successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateUsername = async (req, res) => {
    const { newUsername } = req.body;

    try {
        const user = await UserModel.findById(req.user.id);

        if (!user)
            return res.status(404).json({ message: 'No account with this id was found' });

        // validate input
        const validUsername = validateUsername(newUsername);

        if (!validUsername.success)
            return res.status(400).json({ message: validUsername.message });

        user.username = newUsername;

        await user.save();
        res.status(201).json({ message: 'Username updated successfully.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}