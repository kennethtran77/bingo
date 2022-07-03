import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// use jwt for auth middleware

export const authHeader = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader){
            return res.status(403).json({ success: false, message: "You are not authenticated to make this request." });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ success: false, message: "This token is invalid." });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error);
    }
}

export const authCookie = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(200).send({ success: false, message: "You do not have a refresh token." });
        }

        jwt.verify(refreshToken, process.env.SECRET, (err, user) => {
            if (err) {
                return res.status(200).send({ success: false, message: "This token is invalid." });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error);
    }
}