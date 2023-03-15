const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const CookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const { v4: uuidv4 } = require('uuid');
const jwtSecret = uuidv4();

app.use(express.json());
app.use(CookieParser())
app.use(cors({
    credentials: true,
    origin: 'http://127.0.0.1:5173',
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    next();
});

console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL);

app.get('/test', (req, res) => {
    res.json('test.ok');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });

        const token = jwt.sign({ userId: userDoc._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userDoc = await User.findOne({ email });
        if (!userDoc) {
            return res.status(401).json('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, userDoc.password);
        if (!isPasswordValid) {
            return res.status(401).json('Invalid password');
        }

        const token = jwt.sign({ userId: userDoc._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });
        res.json(userDoc);

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/profile', async (req, res) => {
    try {
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, jwtSecret);
        const userDoc = await User.findById(decodedToken.userId);

        if (!userDoc) {
            return res.status(401).json('User not found');
        }

        res.json(userDoc);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(4000);
