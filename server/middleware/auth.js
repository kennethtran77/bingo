import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// use jwt for auth middleware

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader)
            return res.sendStatus(403);

        const token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });

        // if (token) {
        //     const decodedData = jwt.verify(token, process.env.SECRET);
        //     req.userId = decodedData?.id;
        // }

        //next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;