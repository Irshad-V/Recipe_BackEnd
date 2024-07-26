const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.Token_password, (err, userId) => {

            if (err) {

                if (err.name === 'TokenExpiredError') {

                    return res.status(401).json({ message: 'Token expired' });
                }

                console.error("Token verification failed:", err);
                return res.sendStatus(403);
            }
            req.userId = userId;

            next()
        });
    } else {
        res.sendStatus(401).json({ message: 'Token is missing.' });
    }
}

exports.verifyToken = verifyToken;
