const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'super-secret-key-change-this';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // Expected format: "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token missing.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
};

// Login handler
const login = (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    if (password === ADMIN_PASSWORD) {
        // Issue token valid for 24 hours
        const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
};

module.exports = { authenticateToken, login };
