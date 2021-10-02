import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModel from '../models/user.js';

dotenv.config();

const secret = process.env.SECRET;


const validateUsername = username => {
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

const validatePassword = password => {
    if (password.length < 6)
        return { success: false, message: 'Password must contain at least 6 characters.' };
    
    if (password.search(/[a-z]/i) < 0)
        return { success: false, message: 'Password must contain at least one letter.' };
    
    if (password.search(/[0-9]/) < 0)
        return { success: false, message: 'Password must contain at least one digit.' };
    
    return { success: true };
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // check inputs
        if (!email || !password)
        return res.status(400).json({ message: 'Please fill in all inputs.' });

        // check if account exists
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No account with this email was found.' });
        }

        // check if password is correct
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Incorrect password.' });
        }

        // sign a token
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '6h' });

        res.status(200).json({ token });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: 'Something went wrong...' });
    }
}

export const signUp = async (req, res) => {
    const { email, password, confirmPassword, username } = req.body;

    try {
        // check inputs
        if (!email || !password || !confirmPassword || !username)
            return res.status(400).json({ message: 'Please fill in all inputs.' });

        // validate password
        const validPassword = validatePassword(password);

        if (!validPassword.success)
            return res.status(400).json({ message: validPassword.message });

        if (password !== confirmPassword)
            return res.status(400).json({ message: 'The two passwords do not match.' });

        // validate username
        const validUsername = validateUsername(username);

        if (!validUsername.success)
            return res.status(400).json({ message: validUsername.message });

        // check if account exists
        const user = await UserModel.findOne({ email });

        if (user)
            return res.status(400).json({ message: 'An account with this email already exists.' });
        
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

        const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: '6h' });

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong...' });
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

export const getUsername = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await UserModel.findById(userId);

        if (!user)
            return res.status(404).json({ message: 'No user with this id was found' });
        
        return res.status(200).json(user.username);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getSettings = async (req, res) => {
    // const { username } = req.params;

    try {
        const user = await UserModel.findById(req.user.id);

        if (!user)
            return res.status(404).json({ message: 'No account with this username was found' });

        // if (req.user.id !== userId)
        //     return res.status(403).json({ message: 'Unauthorized action' });

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
            return res.status(400).json({ message: 'Questions per session must be greater than 0 and less than 11.' })

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