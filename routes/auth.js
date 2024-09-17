const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User.js');
const router = express.Router();
const SECRET_KEY = 'hritikPooniya';





router.get('/',(req,res)=>{
    res.send('Hello! for logIn go to /login and for register go to /register');

});

router.post('/register',async (req,res)=>{
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
        return res.status(400).send('All fields are required');
    }

    try {
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = bcrypt.hashSync(password, 8);

        const user = new User({ name, email, password: hashedPassword, role });
        await user.save();

        res.status(201).send('User registered');
    } catch (error) {
        res.status(500).send('Server error');
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        const token = jwt.sign({ name: user.name, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;


